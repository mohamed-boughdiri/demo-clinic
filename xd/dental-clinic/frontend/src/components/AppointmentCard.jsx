import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClinic } from '../context/ClinicContext'
import '../styles/AppointmentCard.css'
import { formatDisplayDateTime } from '../utils/date'

const AppointmentCard = ({ appointment, onDelete }) => {
  const { t } = useTranslation()
  const { singleDoctorMode } = useClinic()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const dentistName = appointment.dentistId?.fullName || appointment.dentist
  const specialty = appointment.dentistId?.specialty || t('appointment.dentalCare')
  const showClinician = !singleDoctorMode

  const statusColors = {
    scheduled: '#10b981',
    completed: '#6b7280',
    cancelled: '#ef4444',
  }

  const statusLabel = t(`status.${appointment.status}`, { defaultValue: appointment.status })

  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <div>
          {showClinician ? (
            <>
              <h3 className="appointment-dentist">{dentistName}</h3>
              <p className="appointment-date">{formatDisplayDateTime(appointment.date, appointment.time)}</p>
              <p className="appointment-date">{specialty}</p>
            </>
          ) : (
            <>
              <h3 className="appointment-dentist">{formatDisplayDateTime(appointment.date, appointment.time)}</h3>
              <p className="appointment-date">{appointment.reason || t('appointment.appointment')}</p>
            </>
          )}
        </div>
        <span
          className="appointment-status"
          style={{ backgroundColor: statusColors[appointment.status] }}
        >
          {statusLabel}
        </span>
      </div>

      <div className="appointment-body">
        {showClinician ? (
          <p className="appointment-reason">
            <strong>{t('appointment.reason')}</strong> {appointment.reason}
          </p>
        ) : null}
        {appointment.symptoms && (
          <p className="appointment-reason">
            <strong>{t('appointment.symptoms')}</strong> {appointment.symptoms}
          </p>
        )}
      </div>

      <div className="appointment-footer">
        {appointment.status === 'scheduled' && (
          <>
            <button
              className="btn btn-outline btn-small appointment-cancel-trigger"
              onClick={() => setShowCancelConfirm(true)}
            >
              {t('appointment.cancelAppointment')}
            </button>
            {showCancelConfirm && (
              <div className="appointment-modal-backdrop" role="presentation">
                <div className="appointment-modal" role="dialog" aria-modal="true">
                  <h4>{t('appointment.cancelConfirmTitle')}</h4>
                  <p>{t('appointment.cancelConfirmDesc')}</p>
                  <div className="appointment-modal-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-small"
                      onClick={() => setShowCancelConfirm(false)}
                    >
                      {t('appointment.keepAppointment')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => {
                        onDelete(appointment._id)
                        setShowCancelConfirm(false)
                      }}
                    >
                      {t('appointment.yesCancel')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AppointmentCard
