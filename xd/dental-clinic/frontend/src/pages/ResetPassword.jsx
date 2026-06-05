import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import PageMeta from '../components/PageMeta'
import '../styles/Auth.css'

export default function ResetPassword() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''
  const type = searchParams.get('type') || 'user'

  const accountType = useMemo(() => (type === 'dentist' ? 'dentist' : 'user'), [type])

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (password.length < 8) {
      setError(t('auth.passwordMin8'))
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/auth/reset-password', {
        token,
        password,
        accountType,
      })
      setMessage(t('auth.passwordUpdated'))
      setTimeout(() => navigate('/login'), 1600)
    } catch (err) {
      setError(err.response?.data?.message || t('auth.resetFailed'))
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-container">
        <PageMeta title={t('auth.resetTitle')} description={t('auth.invalidLinkDesc')} />
        <div className="auth-box">
          <h1>{t('auth.invalidLinkTitle')}</h1>
          <p className="auth-subtitle">{t('auth.invalidLinkDesc')}</p>
          <p className="auth-footer">
            <Link to="/forgot-password">{t('auth.requestNewLink')}</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <PageMeta title={t('auth.resetTitle')} description={t('auth.newPasswordDesc')} />
      <div className="auth-box">
        <h1>{t('auth.newPasswordTitle')}</h1>
        <p className="auth-subtitle">{t('auth.newPasswordDesc')}</p>

        {error ? <div className="alert alert-error">{error}</div> : null}
        {message ? <div className="alert alert-success">{message}</div> : null}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">{t('auth.newPassword')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? t('auth.saving') : t('auth.updatePassword')}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">{t('auth.backToLogin')}</Link>
        </p>
      </div>
    </div>
  )
}
