import React from 'react'
import { useTranslation } from 'react-i18next'
import PageMeta from '../components/PageMeta'

export default function Privacy() {
  const { t } = useTranslation()

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 3rem', maxWidth: '42rem' }}>
      <PageMeta title={t('privacy.title')} description={t('privacy.meta')} />
      <h1>{t('privacy.title')}</h1>
      <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
        {t('privacy.intro')}
      </p>
      <h2 style={{ fontSize: '1.15rem', marginTop: '1.5rem' }}>{t('privacy.whatWeCollect')}</h2>
      <p>{t('privacy.whatWeCollectDesc')}</p>
      <h2 style={{ fontSize: '1.15rem', marginTop: '1.5rem' }}>{t('privacy.howWeUse')}</h2>
      <p>{t('privacy.howWeUseDesc')}</p>
      <h2 style={{ fontSize: '1.15rem', marginTop: '1.5rem' }}>{t('privacy.contactTitle')}</h2>
      <p>
        {t('privacy.contactDesc')} <a href="mailto:privacy@dentalclinic.com">privacy@dentalclinic.com</a>
      </p>
    </div>
  )
}
