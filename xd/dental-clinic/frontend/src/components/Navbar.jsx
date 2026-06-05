import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useClinic } from '../context/ClinicContext'
import '../styles/Navbar.css'

const Navbar = () => {
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
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>

          {auth.token ? (
            <>
              {auth.role === 'patient' ? (
                <>
                  <Link to="/patient-workspace" className="nav-link" onClick={() => setIsOpen(false)}>
                    Workspace
                  </Link>
                  <Link to="/patient-workspace/book" className="nav-link" onClick={() => setIsOpen(false)}>
                    Book visit
                  </Link>
                </>
              ) : auth.role === 'receptionist' ? (
                <Link to="/reception-console" className="nav-link" onClick={() => setIsOpen(false)}>
                  Reception
                </Link>
              ) : auth.role === 'admin' ? (
                <>
                  <Link to="/admin-dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                    Admin
                  </Link>
                  {auth.isPracticeOwner ? (
                    <Link to="/doctor-dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                      My schedule
                    </Link>
                  ) : null}
                </>
              ) : (
                <Link to="/doctor-dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              )}
              <button
                className="btn btn-primary btn-small"
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-link" onClick={() => setIsOpen(false)}>
                <button className="btn btn-primary btn-small">Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
