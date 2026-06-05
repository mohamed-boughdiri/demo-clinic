import React, { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { getActiveLocale } from '../i18n'
import AppointmentCard from '../components/AppointmentCard'
import PageMeta from '../components/PageMeta'
import EmptyState from '../components/EmptyState'
import { SkeletonText, SkeletonCard } from '../components/Skeleton'
import '../styles/Profile.css'
import { formatDisplayDate } from '../utils/date'

const Profile = () => {
  const { t, i18n } = useTranslation()
  const { auth } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [summary, setSummary] = useState(null)
  const [medicalProfile, setMedicalProfile] = useState({
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    medications: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    notes: '',
  })
  const [showMedicalProfile, setShowMedicalProfile] = useState(false)
  const [timelineFilter, setTimelineFilter] = useState('all')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const [appointmentsRes, historyRes] = await Promise.all([
        axios.get('/api/appointments/my', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }),
        axios.get('/api/appointments/history-summary', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }),
      ])
      setAppointments(appointmentsRes.data)
      setSummary(historyRes.data.summary)
      const profile = historyRes.data.patient?.medicalProfile || {}
      setMedicalProfile({
        bloodType: profile.bloodType || '',
        allergies: (profile.allergies || []).join(', '),
        chronicConditions: (profile.chronicConditions || []).join(', '),
        medications: (profile.medications || []).join(', '),
        emergencyContactName: profile.emergencyContactName || '',
        emergencyContactPhone: profile.emergencyContactPhone || '',
        notes: profile.notes || '',
      })
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || t('profile.fetchFailed'))
      setLoading(false)
    }
  }

  const handleMedicalProfileChange = (e) => {
    const { name, value } = e.target
    setMedicalProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleMedicalProfileSave = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await axios.put(
        '/api/appointments/medical-profile',
        {
          medicalProfile: {
            bloodType: medicalProfile.bloodType,
            allergies: medicalProfile.allergies
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
            chronicConditions: medicalProfile.chronicConditions
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
            medications: medicalProfile.medications
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
            emergencyContactName: medicalProfile.emergencyContactName,
            emergencyContactPhone: medicalProfile.emergencyContactPhone,
            notes: medicalProfile.notes,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      setSuccessMessage(t('profile.medicalUpdated'))
      await fetchAppointments()
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || t('profile.medicalUpdateFailed'))
    }
  }

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(`/api/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      setSuccessMessage(t('profile.appointmentCancelled'))
      await fetchAppointments()
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || t('profile.cancelFailed'))
    }
  }

  const groupedAppointments = useMemo(() => {
    const filtered = appointments.filter((appointment) =>
      timelineFilter === 'all' ? true : appointment.status === timelineFilter
    )

    const groups = new Map()
    filtered.forEach((appointment) => {
      const d = new Date(appointment.date)
      const key = d.toLocaleDateString(getActiveLocale(), { year: 'numeric', month: 'long' })
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(appointment)
    })

    return Array.from(groups.entries())
  }, [appointments, timelineFilter, i18n.language])

  return (
    <div className="profile-container">
      <PageMeta title={t('profile.metaTitle')} description={t('profile.metaDescription')} />
      <div className="container">
        <div className="profile-header">
          <h1>{t('profile.title')}</h1>
          <p>{auth.user?.firstName} {auth.user?.lastName}</p>
        </div>

        {summary && (
          <div className="profile-stats">
            <div className="profile-stat-card">
              <span className="profile-stat-label">{t('profile.totalVisits')}</span>
              <span className="profile-stat-value">{summary.totalVisits}</span>
            </div>
            <div className="profile-stat-card">
              <span className="profile-stat-label">{t('profile.completedTreatments')}</span>
              <span className="profile-stat-value">{summary.completedTreatments}</span>
            </div>
            <div className="profile-stat-card">
              <span className="profile-stat-label">{t('profile.upcomingAppointments')}</span>
              <span className="profile-stat-value">{summary.upcomingAppointments}</span>
            </div>
            <div className="profile-stat-card">
              <span className="profile-stat-label">{t('profile.latestDiagnosis')}</span>
              <span className="profile-stat-text">{summary.latestDiagnosis || t('profile.noDiagnosis')}</span>
            </div>
          </div>
        )}

        <div className="profile-content">
          <section className="profile-section">
            <h2>{t('profile.personalInfo')}</h2>
            <div className="user-info">
              <div className="info-card">
                <div className="info-group">
                  <label>{t('common.firstName')}</label>
                  <p>{auth.user?.firstName}</p>
                </div>
                <div className="info-group">
                  <label>{t('common.lastName')}</label>
                  <p>{auth.user?.lastName}</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-group">
                  <label>{t('common.dateOfBirth')}</label>
                  <p>{formatDisplayDate(auth.user?.dateOfBirth)}</p>
                </div>
                <div className="info-group">
                  <label>{t('common.email')}</label>
                  <p>{auth.user?.email}</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-group">
                  <label>{t('common.phone')}</label>
                  <p>{auth.user?.phone}</p>
                </div>
                <div className="info-group">
                  <label>{t('profile.healthTimeline')}</label>
                  <p>{t('profile.healthTimelineDesc')}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="section-heading-row">
              <h2>{t('profile.medicalProfile')}</h2>
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => setShowMedicalProfile((prev) => !prev)}
              >
                {showMedicalProfile ? t('profile.hideDetails') : t('profile.editDetails')}
              </button>
            </div>
            {showMedicalProfile && (
            <form className="clinical-form" onSubmit={handleMedicalProfileSave}>
              <div className="info-card">
                <div className="form-group">
                  <label>{t('profile.bloodType')}</label>
                  <input
                    name="bloodType"
                    value={medicalProfile.bloodType}
                    onChange={handleMedicalProfileChange}
                    placeholder={t('profile.bloodTypePlaceholder')}
                  />
                </div>
                <div className="form-group">
                  <label>{t('profile.medications')}</label>
                  <input
                    name="medications"
                    value={medicalProfile.medications}
                    onChange={handleMedicalProfileChange}
                    placeholder={t('profile.commaSeparated')}
                  />
                </div>
              </div>
              <div className="info-card">
                <div className="form-group">
                  <label>{t('profile.allergies')}</label>
                  <input
                    name="allergies"
                    value={medicalProfile.allergies}
                    onChange={handleMedicalProfileChange}
                    placeholder={t('profile.allergiesPlaceholder')}
                  />
                </div>
                <div className="form-group">
                  <label>{t('profile.chronicConditions')}</label>
                  <input
                    name="chronicConditions"
                    value={medicalProfile.chronicConditions}
                    onChange={handleMedicalProfileChange}
                    placeholder={t('profile.chronicPlaceholder')}
                  />
                </div>
              </div>
              <div className="info-card">
                <div className="form-group">
                  <label>{t('profile.emergencyName')}</label>
                  <input
                    name="emergencyContactName"
                    value={medicalProfile.emergencyContactName}
                    onChange={handleMedicalProfileChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('profile.emergencyPhone')}</label>
                  <input
                    name="emergencyContactPhone"
                    value={medicalProfile.emergencyContactPhone}
                    onChange={handleMedicalProfileChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('profile.clinicalNotes')}</label>
                <textarea
                  name="notes"
                  rows="3"
                  value={medicalProfile.notes}
                  onChange={handleMedicalProfileChange}
                  placeholder={t('profile.clinicalNotesPlaceholder')}
                />
              </div>
              <button className="btn btn-primary" type="submit">
                {t('profile.saveMedicalProfile')}
              </button>
            </form>
            )}
          </section>

          {/* Appointments */}
          <section className="profile-section appointments-section">
            <div className="section-heading-row">
              <h2>{t('profile.clinicalTimeline')}</h2>
              <select
                className="timeline-filter"
                value={timelineFilter}
                onChange={(e) => setTimelineFilter(e.target.value)}
              >
                <option value="all">{t('profile.allVisits')}</option>
                <option value="scheduled">{t('profile.upcoming')}</option>
                <option value="completed">{t('status.completed')}</option>
              </select>
            </div>

            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
              <div className="skeleton-stack" aria-busy="true" aria-label={t('profile.loadingTimeline')}>
                <SkeletonText lines={2} />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : appointments.length === 0 ? (
              <EmptyState
                title={t('profile.noVisits')}
                description={t('profile.noVisitsDesc')}
                actionLabel={t('profile.bookAppointment')}
                actionTo="/patient-workspace/book"
              />
            ) : groupedAppointments.length === 0 ? (
              <EmptyState
                title={t('profile.noFilterMatch')}
                description={t('profile.noFilterDesc')}
              />
            ) : (
              <div className="appointments-list">
                {groupedAppointments.map(([month, items]) => (
                  <details key={month} className="timeline-group" open>
                    <summary className="timeline-summary">
                      <span>{month}</span>
                      <span className="timeline-count">{items.length}</span>
                    </summary>
                    <div className="timeline-items">
                      {items.map((appointment) => (
                        <AppointmentCard
                          key={appointment._id}
                          appointment={appointment}
                          onDelete={handleDeleteAppointment}
                        />
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default Profile
