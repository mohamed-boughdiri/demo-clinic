import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useClinic } from '../context/ClinicContext'
import PageMeta from '../components/PageMeta'
import '../styles/Auth.css'

const specialties = [
  'General Dentistry',
  'Orthodontics',
  'Cosmetic Dentistry',
  'Oral Surgery',
]

export default function CreateStaffAccount() {
  const { auth } = useAuth()
  const { singleDoctorMode } = useClinic()
  const [searchParams] = useSearchParams()
  const authHeader = { headers: { Authorization: `Bearer ${auth.token}` } }
  const [mode, setMode] = useState('staff')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [staffForm, setStaffForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    role: 'receptionist',
  })

  const [doctorForm, setDoctorForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
    licenseNumber: '',
    experienceYears: '',
    currentFocus: '',
    education: '',
    achievements: '',
    about: '',
  })

  useEffect(() => {
    const tab = searchParams.get('tab')
    const staffRole = searchParams.get('staffRole')
    if (singleDoctorMode || tab === 'staff') {
      setMode('staff')
    } else if (tab === 'doctor') {
      setMode('doctor')
    }
    if (staffRole === 'admin' || staffRole === 'receptionist') {
      setStaffForm((p) => ({ ...p, role: staffRole }))
    }
  }, [searchParams, singleDoctorMode])

  const submitStaff = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setLoading(true)
    try {
      await axios.post('/api/admin/staff', staffForm, authHeader)
      setMessage({ type: 'success', text: 'Staff account created.' })
      setStaffForm((p) => ({
        ...p,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      }))
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  const submitDoctor = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setLoading(true)
    try {
      await axios.post('/api/admin/doctors', doctorForm, authHeader)
      setMessage({ type: 'success', text: 'Doctor account created.' })
      setDoctorForm((p) => ({
        ...p,
        fullName: '',
        email: '',
        password: '',
        licenseNumber: '',
      }))
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  const staffTitle =
    staffForm.role === 'admin' ? 'Add administrator' : 'Add receptionist'
  const pageTitle = singleDoctorMode || mode === 'staff' ? staffTitle : 'Add doctor'

  return (
    <div className="auth-container">
      <PageMeta title={pageTitle} description="Admin — create staff accounts." />
      <div className="auth-box" style={{ maxWidth: '480px' }}>
        <h1>{pageTitle}</h1>
        <p className="auth-subtitle">
          {singleDoctorMode
            ? 'Create a receptionist or backup admin account. You are already the doctor — no separate doctor account is needed.'
            : 'Fill out the form below, then the new user signs in from the '}
          {!singleDoctorMode ? <Link to="/login">Login</Link> : null}
          {!singleDoctorMode ? ' page.' : null}
        </p>

        {!singleDoctorMode ? (
          <div className="auth-role-toggle">
            <button
              type="button"
              className={`role-btn ${mode === 'staff' ? 'active' : ''}`}
              onClick={() => setMode('staff')}
            >
              Staff
            </button>
            <button
              type="button"
              className={`role-btn ${mode === 'doctor' ? 'active' : ''}`}
              onClick={() => setMode('doctor')}
            >
              Doctor
            </button>
          </div>
        ) : null}

        {message.text ? (
          <div className={message.type === 'error' ? 'alert alert-error' : 'alert alert-success'}>{message.text}</div>
        ) : null}

        {mode === 'staff' ? (
          <form onSubmit={submitStaff} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>First name</label>
                <input
                  value={staffForm.firstName}
                  onChange={(e) => setStaffForm((p) => ({ ...p, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input
                  value={staffForm.lastName}
                  onChange={(e) => setStaffForm((p) => ({ ...p, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Work email</label>
              <input
                type="email"
                value={staffForm.email}
                onChange={(e) => setStaffForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of birth</label>
                <input
                  type="date"
                  value={staffForm.dateOfBirth}
                  onChange={(e) => setStaffForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                  required
                />
              </div>
            </div>
            {!searchParams.get('staffRole') ? (
              <div className="form-group">
                <label>Role</label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm((p) => ({ ...p, role: e.target.value }))}
                >
                  <option value="receptionist">Receptionist</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            ) : null}
            <div className="form-group">
              <label>Initial password</label>
              <input
                type="password"
                value={staffForm.password}
                onChange={(e) => setStaffForm((p) => ({ ...p, password: e.target.value }))}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving…' : staffForm.role === 'admin' ? 'Create admin account' : 'Create receptionist account'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitDoctor} className="auth-form">
            <div className="form-group">
              <label>Full name</label>
              <input
                value={doctorForm.fullName}
                onChange={(e) => setDoctorForm((p) => ({ ...p, fullName: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={doctorForm.email}
                onChange={(e) => setDoctorForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  value={doctorForm.phone}
                  onChange={(e) => setDoctorForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={doctorForm.password}
                  onChange={(e) => setDoctorForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  minLength={8}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Specialty</label>
                <select
                  value={doctorForm.specialty}
                  onChange={(e) => setDoctorForm((p) => ({ ...p, specialty: e.target.value }))}
                  required
                >
                  <option value="">Select</option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>License #</label>
                <input
                  value={doctorForm.licenseNumber}
                  onChange={(e) => setDoctorForm((p) => ({ ...p, licenseNumber: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Experience (years)</label>
              <input
                type="number"
                min="0"
                value={doctorForm.experienceYears}
                onChange={(e) => setDoctorForm((p) => ({ ...p, experienceYears: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving…' : 'Create doctor account'}
            </button>
          </form>
        )}

        <p className="auth-footer">
          <Link to="/admin-dashboard">← Admin home</Link>
        </p>
      </div>
    </div>
  )
}
