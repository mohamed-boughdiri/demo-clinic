import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import axios from 'axios'
import PageMeta from '../components/PageMeta'
import '../styles/Auth.css'

export default function PatientSignUp() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post('/api/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || t('auth.registrationFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <PageMeta title={t('auth.registerTitle')} description={t('auth.registerMeta')} />
      <div className="auth-box">
        <h1>{t('auth.registerTitle')}</h1>
        <p className="auth-subtitle">
          <Trans i18nKey="auth.registerSubtitle" />
        </p>

        {error ? <div className="alert alert-error">{error}</div> : null}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">{t('common.firstName')}</label>
              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">{t('common.lastName')}</label>
              <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">{t('common.dateOfBirth')}</label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t('common.email')}</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">{t('common.phone')}</label>
              <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">{t('common.password')}</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
          </div>
          <p className="auth-inline-hint text-secondary">{t('auth.minPassword')}</p>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? t('auth.creatingAccount') : t('auth.registerTitle')}
          </button>
        </form>

        <p className="auth-footer">
          {t('auth.alreadyHaveAccount')} <Link to="/login">{t('common.signIn')}</Link>
        </p>
      </div>
    </div>
  )
}
