import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import PageMeta from '../components/PageMeta'
import { useAuth } from '../context/AuthContext'
import { useClinic } from '../context/ClinicContext'
import '../styles/AdminDashboard.css'

function AdminCardIcon({ children }) {
  return (
    <span className="admin-hub__card-icon" aria-hidden="true">
      <svg className="admin-hub__card-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {children}
      </svg>
    </span>
  )
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const { auth } = useAuth()
  const { singleDoctorMode } = useClinic()
  const isPracticeOwner = auth.isPracticeOwner && singleDoctorMode
  const doctorProfile = auth.dentist

  return (
    <div className="admin-hub">
      <PageMeta title={t('admin.metaTitle')} description={t('admin.metaDescription')} />
      <h1 className="admin-hub__title">{t('admin.title')}</h1>
      <p className="admin-hub__lead">
        {isPracticeOwner ? (
          <>
            {t('admin.soloLead')}
            <Link to="/doctor-dashboard">{t('admin.mySchedule')}</Link>
            {t('admin.soloLeadEnd')}
          </>
        ) : (
          <>
            {t('admin.multiLead')}
            <Link to="/register">{t('admin.patientRegistration')}</Link>
            {t('admin.multiLeadEnd')}
          </>
        )}
      </p>

      <div className="admin-hub__grid">
        {isPracticeOwner ? (
          <Link className="admin-hub__card" to="/doctor-dashboard">
            <AdminCardIcon>
              <path
                d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </AdminCardIcon>
            <h2>{t('admin.mySchedule')}</h2>
            <p>
              {doctorProfile?.fullName
                ? t('admin.myScheduleDesc', { name: doctorProfile.fullName })
                : t('admin.myScheduleDescDefault')}
            </p>
            <span className="admin-hub__card-cta">{t('admin.openDoctorDashboard')}</span>
          </Link>
        ) : null}

        <Link className="admin-hub__card" to="/admin-dashboard/provision?tab=staff">
          <AdminCardIcon>
            <path
              d="M5 21V10.8c0-.53.21-1.04.59-1.42l4.7-4.7a2 2 0 012.82 0l4.71 4.7c.38.38.59.89.59 1.42V21"
              stroke="currentColor"
              strokeWidth="1.65"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 21v-5h6v5M12 7v4"
              stroke="currentColor"
              strokeWidth="1.65"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </AdminCardIcon>
          <h2>{t('admin.addReceptionist')}</h2>
          <p>{t('admin.addReceptionistDesc')}</p>
          <span className="admin-hub__card-cta">{t('admin.openForm')}</span>
        </Link>

        <Link className="admin-hub__card" to="/admin-dashboard/provision?tab=staff&staffRole=admin">
          <AdminCardIcon>
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="currentColor"
              strokeWidth="1.65"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.65"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </AdminCardIcon>
          <h2>{t('admin.addAdmin')}</h2>
          <p>{t('admin.addAdminDesc')}</p>
          <span className="admin-hub__card-cta">{t('admin.openForm')}</span>
        </Link>

        {!isPracticeOwner && !singleDoctorMode ? (
          <Link className="admin-hub__card" to="/admin-dashboard/provision?tab=doctor">
            <AdminCardIcon>
              <path
                d="M12 3c-1.72 0-2.94 1.12-3.08 2.72-.06.72-.35 1.22-.82 2.02-.52.88-.9 2.1-.9 4.06v7.05c0 .88.72 1.6 1.6 1.6.53 0 1.02-.26 1.32-.68.32-.46.92-.74 1.6-.74.7 0 1.3.3 1.62.76.3.42.78.66 1.3.66.88 0 1.6-.72 1.6-1.6v-7.05c0-1.96-.38-3.18-.9-4.06-.47-.8-.76-1.3-.82-2.02C14.94 4.12 13.72 3 12 3z"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </AdminCardIcon>
            <h2>{t('admin.setupDoctor')}</h2>
            <p>{t('admin.setupDoctorDesc')}</p>
            <span className="admin-hub__card-cta">{t('admin.openForm')}</span>
          </Link>
        ) : null}
      </div>

      {isPracticeOwner ? (
        <div className="admin-hub__note">
          <Trans
            i18nKey="admin.soloNote"
            values={{ email: auth.user?.email }}
            components={{ strong: <strong /> }}
          />
        </div>
      ) : (
        <div className="admin-hub__note">
          <Trans i18nKey="admin.tipNote" components={{ strong: <strong /> }} />
        </div>
      )}
    </div>
  )
}
