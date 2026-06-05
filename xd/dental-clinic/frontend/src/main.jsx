import React from 'react'
import ReactDOM from 'react-dom/client'
import './i18n'
import App from './App'
import './index.css'
import './styles/rtl.css'
import { AuthProvider } from './context/AuthContext'
import { ClinicProvider } from './context/ClinicContext'
import { ToastProvider } from './context/ToastContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClinicProvider>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </ClinicProvider>
  </React.StrictMode>,
)
