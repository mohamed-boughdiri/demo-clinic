import React from 'react'
import { Link } from 'react-router-dom'
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
  const { auth } = useAuth()
  const { singleDoctorMode } = useClinic()
  const isPracticeOwner = auth.isPracticeOwner && singleDoctorMode
  const doctorProfile = auth.dentist

  return (
    <div className="admin-hub">
      <PageMeta title="Admin" description="Clinic administration." />
      <h1 className="admin-hub__title">Administration</h1>
      <p className="admin-hub__lead">
        {isPracticeOwner
          ? 'You run this solo practice with one login. Manage staff here, then open '
          : 'Add people who work at the clinic. Patients sign themselves up from the public '}
        {isPracticeOwner ? (
          <>
            <Link to="/doctor-dashboard">My schedule</Link> for your patient appointments.
          </>
        ) : (
          <>
            <Link to="/register">patient registration</Link> page.
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
            <h2>My schedule</h2>
            <p>
              {doctorProfile?.fullName
                ? `${doctorProfile.fullName} — view today’s appointments, patients, and notes.`
                : 'View your appointments, patients, and clinical notes.'}
            </p>
            <span className="admin-hub__card-cta">Open doctor dashboard →</span>
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
          <h2>Add receptionist</h2>
          <p>Front desk can search patients, manage the lobby, and book appointments for them.</p>
          <span className="admin-hub__card-cta">Open form →</span>
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
          <h2>Add another administrator</h2>
          <p>Optional backup admin with the same powers (separate email and password).</p>
          <span className="admin-hub__card-cta">Open form →</span>
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
            <h2>Set up your doctor</h2>
            <p>Create the doctor account for this practice.</p>
            <span className="admin-hub__card-cta">Open form →</span>
          </Link>
        ) : null}
      </div>

      {isPracticeOwner ? (
        <div className="admin-hub__note">
          <strong>One login for everything:</strong> you are signed in as admin and doctor with{' '}
          <strong>{auth.user?.email}</strong>. Use <strong>Admin</strong> for staff setup and{' '}
          <strong>My schedule</strong> for your clinical work.
        </div>
      ) : (
        <div className="admin-hub__note">
          <strong>Tip:</strong> In solo practice mode the admin account is also the doctor — sign in with your admin
          email once to access both areas.
        </div>
      )}
    </div>
  )
}
