import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useClinic } from '../context/ClinicContext'
import PageMeta from '../components/PageMeta'
import EmptyState from '../components/EmptyState'
import '../styles/BookAppointment.css'
import CalendarPicker from '../components/CalendarPicker'

const VISIT_REASONS = [
  { value: 'Regular Checkup', key: 'regularCheckup' },
  { value: 'Cleaning', key: 'cleaning' },
  { value: 'Filling', key: 'filling' },
  { value: 'Root Canal', key: 'rootCanal' },
  { value: 'Extraction', key: 'extraction' },
  { value: 'Teeth Whitening', key: 'teethWhitening' },
  { value: 'Braces Adjustment', key: 'bracesAdjustment' },
  { value: 'Other', key: 'other' },
]

const BookAppointment = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { auth } = useAuth()
  const { singleDoctorMode } = useClinic()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dentists, setDentists] = useState([])
  const [loadingDentists, setLoadingDentists] = useState(true)
  const [availability, setAvailability] = useState(null)
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [monthDate, setMonthDate] = useState(() => new Date())

  const [formData, setFormData] = useState({
    dentistId: '',
    date: '',
    time: '',
    reason: '',
    symptoms: '',
    urgency: 'medium',
  })

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await axios.get('/api/dentist/list')
        setDentists(response.data)
      } catch (err) {
        setError(err.response?.data?.message || t('booking.loadDentistsFailed'))
      } finally {
        setLoadingDentists(false)
      }
    }

    fetchDentists()
  }, [])

  const practiceDentist = singleDoctorMode && dentists.length > 0 ? dentists[0] : null
  const hideDentistPicker = !!practiceDentist

  useEffect(() => {
    if (practiceDentist && !formData.dentistId) {
      setFormData((prev) => ({ ...prev, dentistId: practiceDentist._id }))
    }
  }, [practiceDentist, formData.dentistId])

  const availabilityAnchor = useMemo(() => {
    const y = monthDate.getFullYear()
    const m = String(monthDate.getMonth() + 1).padStart(2, '0')
    return `${y}-${m}-01`
  }, [monthDate])

  const reloadAvailability = useCallback(async () => {
    if (!formData.dentistId) {
      setAvailability(null)
      return
    }

    try {
      setLoadingAvailability(true)
      const days = 75
      const response = await axios.get(
        `/api/appointments/availability/${formData.dentistId}?days=${days}&anchor=${availabilityAnchor}`
      )
      setAvailability(response.data)
    } catch (err) {
      setError(err.response?.data?.message || t('booking.loadAvailabilityFailed'))
      setAvailability(null)
    } finally {
      setLoadingAvailability(false)
    }
  }, [formData.dentistId, availabilityAnchor])

  useEffect(() => {
    reloadAvailability()
  }, [reloadAvailability])

  const selectedDateAvailability = useMemo(
    () => availability?.calendar?.find((item) => item.date === formData.date),
    [availability, formData.date]
  )

  const dateBadges = useMemo(() => {
    const badges = {}
    ;(availability?.calendar || []).forEach((d) => {
      if (!d?.date) return
      if (d.isFullyBooked) return
      const count = d.availableSlots?.length || 0
      badges[d.date] = { text: String(count), variant: 'primary' }
    })
    return badges
  }, [availability])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'dentistId' ? { date: '', time: '' } : {}),
      ...(name === 'date' ? { time: '' } : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axios.post(
        '/api/appointments',
        {
          dentistId: formData.dentistId,
          date: formData.date,
          time: formData.time,
          reason: formData.reason,
          symptoms: formData.symptoms,
          urgency: formData.urgency,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )

      setLoading(false)
      navigate('/patient-workspace')
    } catch (err) {
      setError(err.response?.data?.message || t('booking.bookFailed'))
      setLoading(false)
    }
  }

  return (
    <div className="book-appointment-container">
      <PageMeta title={t('booking.metaTitle')} description={t('booking.metaDescription')} />
      <div className="container">
        <div className="book-header">
          <h1>{t('booking.title')}</h1>
          <p>{t('booking.subtitle')}</p>
        </div>

        <div className="book-content">
          {!loadingDentists && dentists.length === 0 ? (
            <EmptyState
              title={t('booking.unavailableTitle')}
              description={t('booking.unavailableDesc')}
            />
          ) : (
            <>
          <form onSubmit={handleSubmit} className="booking-form">
            {error && <div className="alert alert-error">{error}</div>}

            {!hideDentistPicker && (
              <div className="form-group">
                <label htmlFor="dentist">{t('booking.selectDentist')}</label>
                <select
                  id="dentist"
                  name="dentistId"
                  value={formData.dentistId}
                  onChange={handleChange}
                  required
                  disabled={loadingDentists}
                >
                  <option value="">{t('booking.chooseDentist')}</option>
                  {dentists.map((dentist) => (
                    <option key={dentist._id} value={dentist._id}>
                      {dentist.fullName} - {dentist.specialty}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">{t('booking.appointmentDate')}</label>
                <div style={{ opacity: !formData.dentistId ? 0.7 : 1 }}>
                  <CalendarPicker
                    title={
                      !formData.dentistId
                        ? hideDentistPicker
                          ? t('booking.loadingAvailability')
                          : t('booking.selectDentistFirst')
                        : loadingAvailability
                        ? t('booking.loadingAvailability')
                        : t('booking.pickAvailableDay')
                    }
                    monthDate={monthDate}
                    availableDates={availability?.availableDates || []}
                    selectedDate={formData.date}
                    dateBadges={dateBadges}
                    onSelect={(dateKey) =>
                      setFormData((prev) => ({ ...prev, date: dateKey, time: '' }))
                    }
                  />
                  <div className="form-row" style={{ marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-small"
                      onClick={() =>
                        setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
                      }
                      disabled={!formData.dentistId}
                    >
                      {t('common.previous')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-small"
                      onClick={() =>
                        setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                      }
                      disabled={!formData.dentistId}
                    >
                      {t('common.next')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="time">{t('booking.timeSlot')}</label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  disabled={!formData.date}
                >
                  <option value="">
                    {formData.date ? t('booking.selectTime') : t('booking.selectDateFirst')}
                  </option>
                  {(selectedDateAvailability?.availableSlots || []).map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reason">{t('booking.reasonForVisit')}</label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
              >
                <option value="">{t('booking.selectReason')}</option>
                {VISIT_REASONS.map((reason) => (
                  <option key={reason.key} value={reason.value}>
                    {t(`reasons.${reason.key}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="urgency">{t('booking.urgency')}</label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                >
                  <option value="low">{t('urgency.low')}</option>
                  <option value="medium">{t('urgency.medium')}</option>
                  <option value="high">{t('urgency.high')}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="symptoms">{t('booking.symptoms')}</label>
                <input
                  type="text"
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder={t('booking.symptomsPlaceholder')}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? t('booking.booking') : t('booking.bookAppointment')}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/patient-workspace')}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>

          <div className="booking-info">
            <h3>{t('booking.infoTitle')}</h3>
            <ul>
              <li>{t('booking.info1')}</li>
              <li>{t('booking.info2')}</li>
              <li>{t('booking.info3')}</li>
              <li>{t('booking.info4')}</li>
              <li>{t('booking.info5')}</li>
            </ul>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
