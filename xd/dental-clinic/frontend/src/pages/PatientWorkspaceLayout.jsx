import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/PatientWorkspaceLayout.css'

export default function PatientWorkspaceLayout() {
  const { t } = useTranslation()

  return (
    <div className="patient-workspace">
      <div className="container patient-workspace__inner">
        <nav className="patient-workspace__nav" aria-label="Patient workspace">
          <NavLink
            to="/patient-workspace"
            end
            className={({ isActive }) =>
              `patient-workspace__tab ${isActive ? 'patient-workspace__tab--active' : ''}`
            }
          >
            {t('workspace.overview')}
          </NavLink>
          <NavLink
            to="/patient-workspace/book"
            className={({ isActive }) =>
              `patient-workspace__tab ${isActive ? 'patient-workspace__tab--active' : ''}`
            }
          >
            {t('workspace.bookVisit')}
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </div>
  )
}
