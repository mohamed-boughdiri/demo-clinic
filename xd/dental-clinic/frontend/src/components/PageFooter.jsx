import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useClinic } from '../context/ClinicContext'
import '../styles/PageFooter.css'

export default function PageFooter() {
  const { t } = useTranslation()
  const { clinicName, tagline } = useClinic()

  return (
    <footer className="page-footer">
      <div className="container page-footer__inner">
        <div className="page-footer__block">
          <strong className="page-footer__brand">{clinicName}</strong>
          <p className="page-footer__muted">{tagline}</p>
        </div>
        <div className="page-footer__block">
          <h2 className="page-footer__heading">{t('common.hours')}</h2>
          <p>{t('footer.hoursWeekday')}</p>
          <p>{t('footer.hoursSaturday')}</p>
        </div>
        <div className="page-footer__block">
          <h2 className="page-footer__heading">{t('common.contact')}</h2>
          <p>
            <a href="tel:+15551234567">+1 (555) 123-4567</a>
          </p>
          <p>
            <a href="mailto:hello@dentalclinic.com">hello@dentalclinic.com</a>
          </p>
        </div>
        <div className="page-footer__block page-footer__links">
          <Link to="/privacy">{t('common.privacy')}</Link>
          <Link to="/login">{t('common.signIn')}</Link>
          <Link to="/register">{t('common.signUp')}</Link>
        </div>
      </div>
      <div className="page-footer__bar">
        <div className="container page-footer__bar-inner">
          <span>© {new Date().getFullYear()} {clinicName}</span>
        </div>
      </div>
    </footer>
  )
}
