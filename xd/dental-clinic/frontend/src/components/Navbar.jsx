import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useClinic } from '../context/ClinicContext'
import LanguageSwitcher from './LanguageSwitcher'
import '../styles/Navbar.css'

const Navbar = () => {
  const { t } = useTranslation()
  const { auth, logout } = useAuth()
  const { clinicName, tagline } = useClinic()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-mark" aria-hidden="true">
            <span className="logo-mark-ring"></span>
            <span className="logo-mark-core">DC</span>
          </span>
          <span className="logo-text">
            <strong>{clinicName}</strong>
            <small>{tagline}</small>
          </span>
        </Link>

        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <LanguageSwitcher compact />
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
            {t('common.home')}
          </Link>

          {auth.token ? (
            <>
              {auth.role === 'patient' ? (
                <>
                  <Link to="/patient-workspace" className="nav-link" onClick={() => setIsOpen(false)}>
                    {t('nav.workspace')}
                  </Link>
                  <Link to="/patient-workspace/book" className="nav-link" onClick={() => setIsOpen(false)}>
                    {t('nav.bookVisit')}
                  </Link>
                </>
              ) : auth.role === 'receptionist' ? (
                <Link to="/reception-console" className="nav-link" onClick={() => setIsOpen(false)}>
                  {t('nav.reception')}
                </Link>
              ) : auth.role === 'admin' ? (
                <>
                  <Link to="/admin-dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                    {t('nav.admin')}
                  </Link>
                  {auth.isPracticeOwner ? (
                    <Link to="/doctor-dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                      {t('nav.mySchedule')}
                    </Link>
                  ) : null}
                </>
              ) : (
                <Link to="/doctor-dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                  {t('nav.dashboard')}
                </Link>
              )}
              <button
                className="btn btn-primary btn-small"
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
              >
                {t('common.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>
                {t('common.login')}
              </Link>
              <Link to="/register" className="nav-link" onClick={() => setIsOpen(false)}>
                <button className="btn btn-primary btn-small">{t('common.signUp')}</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
