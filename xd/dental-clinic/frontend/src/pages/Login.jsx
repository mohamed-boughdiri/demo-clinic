import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { safePostLoginRedirect } from '../auth/rbac'
import PageMeta from '../components/PageMeta'
import '../styles/Auth.css'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/auth/login', formData)
      const resolvedRole = response.data.role

      const userPayload =
        resolvedRole === 'doctor' ? response.data.dentist : response.data.user

      if (!userPayload) {
        setError(t('auth.incompleteLogin'))
        setLoading(false)
        return
      }

      login(response.data.token, userPayload, resolvedRole, {
        isPracticeOwner: response.data.isPracticeOwner,
        dentistId: response.data.dentistId,
        dentist: response.data.dentist,
      })
      setLoading(false)

      const target = safePostLoginRedirect(resolvedRole, location.state?.from)
      navigate(target, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || t('auth.loginFailed'))
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <PageMeta title={t('auth.signInTitle')} description={t('auth.signInMeta')} />
      <div className="auth-box">
        <h1>{t('auth.signInTitle')}</h1>
        <p className="auth-subtitle">{t('auth.signInSubtitle')}</p>

        {error && <div className="alert alert-error">{error}</div>}

        {import.meta.env.DEV && (
          <p className="auth-inline-hint text-secondary" style={{ marginBottom: '0.75rem' }}>
            Dev practice owner login: <strong>admin@example.com</strong> / <strong>admin12345</strong> (admin +
            doctor in one account)
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">{t('common.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('common.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <p className="auth-inline-hint">
              <Link to="/forgot-password">{t('auth.forgotPassword')}</Link> {t('auth.forgotPasswordHint')}
            </p>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? t('auth.signingIn') : t('common.signIn')}
          </button>
        </form>

        <p className="auth-footer">
          {t('auth.newPatient')} <Link to="/register">{t('auth.createPatientAccount')}</Link>
        </p>
        <p className="auth-footer" style={{ fontSize: '0.85rem' }}>
          {t('auth.receptionHint')}
        </p>
      </div>
    </div>
  )
}

export default Login
