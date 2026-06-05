import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const ClinicContext = createContext({
  clinicName: 'Bright Smile Dental',
  tagline: 'Your trusted local dentist',
  singleDoctorMode: true,
  loading: true,
})

export function ClinicProvider({ children }) {
  const [clinic, setClinic] = useState({
    clinicName: 'Bright Smile Dental',
    tagline: 'Your trusted local dentist',
    singleDoctorMode: true,
    loading: true,
  })

  useEffect(() => {
    axios
      .get('/api/clinic')
      .then(({ data }) => {
        setClinic({
          clinicName: data.clinicName || 'Bright Smile Dental',
          tagline: data.tagline || 'Your trusted local dentist',
          singleDoctorMode: data.singleDoctorMode !== false,
          loading: false,
        })
      })
      .catch(() => {
        setClinic((prev) => ({ ...prev, loading: false }))
      })
  }, [])

  return <ClinicContext.Provider value={clinic}>{children}</ClinicContext.Provider>
}

export function useClinic() {
  return useContext(ClinicContext)
}
