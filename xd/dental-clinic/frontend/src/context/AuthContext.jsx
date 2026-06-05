import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

function normalizeUser(user, role) {
  if (!user) return null
  const id = user.id ?? user._id
  return {
    ...user,
    id,
    email: user.email,
    role,
  }
}

/** Migrate JWT/localStorage from legacy role names */
function normalizeStoredRole(role) {
  if (role === 'dentist') return 'doctor'
  if (role === 'reception') return 'receptionist'
  return role
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('auth')
    if (!savedAuth) return { token: null, user: null, role: null }
    try {
      const parsed = JSON.parse(savedAuth)
      const role = normalizeStoredRole(parsed.role)
      return {
        ...parsed,
        role,
        user: normalizeUser(parsed.user, role),
        isPracticeOwner: !!parsed.isPracticeOwner,
        dentistId: parsed.dentistId || null,
        dentist: parsed.dentist || null,
      }
    } catch {
      return { token: null, user: null, role: null }
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const login = (token, user, role = 'patient', options = {}) => {
    const normalized = normalizeUser(user, role)
    const authData = {
      token,
      user: normalized,
      role,
      isPracticeOwner: !!options.isPracticeOwner,
      dentistId: options.dentistId || null,
      dentist: options.dentist || null,
    }
    setAuth(authData)
    localStorage.setItem('auth', JSON.stringify(authData))
  }

  const logout = () => {
    setAuth({
      token: null,
      user: null,
      role: null,
      isPracticeOwner: false,
      dentistId: null,
      dentist: null,
    })
    localStorage.removeItem('auth')
  }

  const isAuthenticated = !!auth.token

  // Keep stored dentist profile in sync with the single canonical clinic name (not legacy per-dentist values).
  useEffect(() => {
    const profile = auth.dentist || (auth.role === 'doctor' ? auth.user : null)
    if (!auth.token || !profile) return
    if (auth.role !== 'doctor' && !auth.isPracticeOwner) return
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await axios.get('/api/clinic')
        if (cancelled || !data?.clinicName) return
        setAuth((prev) => {
          if (!prev.token) return prev
          const current = prev.dentist || (prev.role === 'doctor' ? prev.user : null)
          if (!current) return prev
          if (current.clinicName === data.clinicName) return prev
          const nextProfile = { ...current, clinicName: data.clinicName }
          const next =
            prev.isPracticeOwner && prev.dentist
              ? { ...prev, dentist: nextProfile }
              : { ...prev, user: nextProfile }
          localStorage.setItem('auth', JSON.stringify(next))
          return next
        })
      } catch {
        /* ignore — dashboard/profile still return canonical name */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [auth.token, auth.role, auth.isPracticeOwner, auth.dentist])

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, isAuthenticated, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
