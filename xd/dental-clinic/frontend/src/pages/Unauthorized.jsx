import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import PageMeta from '../components/PageMeta'
import { dashboardPathForRole } from '../auth/rbac'

export default function Unauthorized() {
  const { t } = useTranslation()
  const { auth, isAuthenticated } = useAuth()
  const location = useLocation()
  const tried = location.state?.from || 'that page'
  const home = isAuthenticated ? dashboardPathForRole(auth.role) : '/login'

  return (
    <div className="container text-center" style={{ padding: '3rem 1rem' }}>
      <PageMeta title={t('unauthorized.title')} description={t('unauthorized.description')} />
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('unauthorized.accessDenied')}</h1>
      <p className="text-secondary" style={{ marginBottom: '0.35rem' }}>
        <Trans i18nKey="unauthorized.roleDenied" values={{ page: tried }} components={{ strong: <strong /> }} />
      </p>
      {isAuthenticated ? (
        <p className="text-secondary" style={{ marginBottom: '1.25rem' }}>
          <Trans
            i18nKey="unauthorized.signedInAs"
            values={{ email: auth.user?.email, role: auth.role }}
            components={{ strong: <strong /> }}
          />
        </p>
      ) : null}
      <Link to={home} className="btn btn-primary">
        {isAuthenticated ? t('unauthorized.goToDashboard') : t('common.signIn')}
      </Link>
      <p style={{ marginTop: '1rem' }}>
        <Link to="/">{t('common.home')}</Link>
      </p>
    </div>
  )
}
