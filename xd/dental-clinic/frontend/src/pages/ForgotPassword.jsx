import React, { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import PageMeta from '../components/PageMeta'
import '../styles/Auth.css'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const roleHint = searchParams.get('role') || 'patient'

  const initialAccountType = useMemo(() => {
    if (roleHint === 'dentist') return 'dentist'
    return 'user'
  }, [roleHint])

  const [email, setEmail] = useState('')
  const [accountType, setAccountType] = useState(initialAccountType)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      await axios.post('/api/auth/forgot-password', { email, accountType })
      setMessage(t('auth.resetSent'))
    } catch (err) {
      setError(err.response?.data?.message || t('auth.somethingWrong'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <PageMeta title={t('auth.forgotTitle')} description={t('auth.forgotMeta')} />
      <div className="auth-box">
        <h1>{t('auth.forgotTitle')}</h1>
        <p className="auth-subtitle">{t('auth.forgotSubtitle')}</p>

        {error ? <div className="alert alert-error">{error}</div> : null}
        {message ? <div className="alert alert-success">{message}</div> : null}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="acct">{t('auth.accountType')}</label>
            <select
              id="acct"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="user">{t('auth.patientOrReception')}</option>
              <option value="dentist">{t('auth.dentist')}</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="email">{t('common.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? t('auth.sending') : t('auth.sendResetLink')}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">{t('auth.backToLogin')}</Link>
        </p>
      </div>
    </div>
  )
}
