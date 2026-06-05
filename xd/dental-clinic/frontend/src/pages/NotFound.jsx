import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageMeta from '../components/PageMeta'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="container text-center" style={{ padding: '4rem 1rem' }}>
      <PageMeta title={t('notFound.title')} description={t('notFound.description')} />
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404</h1>
      <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
        {t('notFound.message')}
      </p>
      <Link to="/" className="btn btn-primary">
        {t('common.backToHome')}
      </Link>
    </div>
  )
}
