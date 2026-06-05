import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useClinic } from '../context/ClinicContext'
import PageMeta from '../components/PageMeta'
import '../styles/Landing.css'
import oralSurgeryImage from '../assets/landing/oral-surgery.jpeg'
import followUpImage from '../assets/landing/follow-up.jpg'
import digitalClinicalRecordsImage from '../assets/landing/digital-clinical-records.jpg'

const Landing = () => {
  const { t } = useTranslation()
  const { clinicName } = useClinic()

  const fallbackVisual = (title, tone = '#0f4c81') =>
    `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${tone}" />
            <stop offset="100%" stop-color="#1f7cc0" />
          </linearGradient>
        </defs>
        <rect width="1200" height="700" fill="url(#g)"/>
        <circle cx="1020" cy="120" r="160" fill="rgba(255,255,255,0.15)"/>
        <circle cx="210" cy="580" r="190" fill="rgba(255,255,255,0.12)"/>
        <text x="80" y="360" fill="white" font-size="64" font-family="Arial" font-weight="700">${title}</text>
      </svg>
    `)}`

  const withFallback = (label, tone) => (e) => {
    e.currentTarget.src = fallbackVisual(label, tone)
  }

  const trustHighlights = [
    {
      title: t('landing.sterilization'),
      text: t('landing.sterilizationDesc'),
      image:
        'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: t('landing.transparentTreatment'),
      text: t('landing.transparentTreatmentDesc'),
      image:
        'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: t('landing.personalizedCare'),
      text: t('landing.personalizedCareDesc'),
      image:
        'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: t('landing.digitalRecords'),
      text: t('landing.digitalRecordsDesc'),
      image: digitalClinicalRecordsImage,
    },
  ]

  return (
    <div className="landing">
      <PageMeta title={t('landing.metaTitle')} description={t('landing.metaDescription')} />
      <section className="hero">
        <div className="hero-content">
          <h1>{t('landing.heroTitle')}</h1>
          <p>{t('landing.heroSubtitle')}</p>
          <div className="hero-buttons">
            <Link to="/patient-workspace/book" className="btn btn-primary">
              {t('landing.bookAppointment')}
            </Link>
            <Link to="/register" className="btn btn-outline">
              {t('common.signUp')}
            </Link>
          </div>
        </div>
      </section>

      <section className="live-strip">
        <div className="container live-strip-grid">
          <article>
            <strong>+1,200</strong>
            <span>{t('landing.statPatients')}</span>
          </article>
          <article>
            <strong>98%</strong>
            <span>{t('landing.statFollowUp')}</span>
          </article>
          <article>
            <strong>Same-day</strong>
            <span>{t('landing.statSameDay')}</span>
          </article>
        </div>
      </section>

      <section className="services services-premium">
        <div className="container">
          <h2>{t('landing.trustTitle')}</h2>
          <div className="feature-grid">
            <div className="feature-tile">
              <img
                className="feature-media"
                data-variant="a"
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80"
                alt={t('landing.connectedAppointments')}
                onError={withFallback(t('landing.connectedAppointments'), '#0f4c81')}
              />
              <h3>{t('landing.connectedAppointments')}</h3>
              <p>{t('landing.connectedAppointmentsDesc')}</p>
            </div>
            <div className="feature-tile">
              <img
                className="feature-media"
                data-variant="b"
                src="https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=1200&q=80"
                alt={t('landing.clinicalContext')}
                onError={withFallback(t('landing.clinicalContext'), '#12795f')}
              />
              <h3>{t('landing.clinicalContext')}</h3>
              <p>{t('landing.clinicalContextDesc')}</p>
            </div>
            <div className="feature-tile">
              <img
                className="feature-media"
                data-variant="c"
                src={followUpImage}
                alt={t('landing.followUpPlanning')}
                onError={withFallback(t('landing.followUpPlanning'), '#4c56bc')}
              />
              <h3>{t('landing.followUpPlanning')}</h3>
              <p>{t('landing.followUpPlanningDesc')}</p>
            </div>
            <div className="feature-tile">
              <img
                className="feature-media"
                data-variant="d"
                src="https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=1200&q=80"
                alt={t('landing.scheduleVisibility')}
                onError={withFallback(t('landing.scheduleVisibility'), '#ad6e0d')}
              />
              <h3>{t('landing.scheduleVisibility')}</h3>
              <p>{t('landing.scheduleVisibilityDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container">
          <div className="trust-strip-header">
            <h2>{t('landing.whyPatientsTitle')}</h2>
            <p>{t('landing.whyPatientsSubtitle')}</p>
          </div>
          <div className="trust-strip-inner">
            {trustHighlights.map((item) => (
              <article className="trust-item" key={item.title}>
                <img src={item.image} alt={item.title} onError={withFallback(item.title, '#0f4c81')} />
                <div className="trust-item-body">
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="care-path">
        <div className="container">
          <h2>{t('landing.carePathTitle')}</h2>
          <div className="care-path-grid">
            <article>
              <strong>01</strong>
              <h3>{t('landing.step1Title')}</h3>
              <p>{t('landing.step1Desc')}</p>
            </article>
            <article>
              <strong>02</strong>
              <h3>{t('landing.step2Title')}</h3>
              <p>{t('landing.step2Desc')}</p>
            </article>
            <article>
              <strong>03</strong>
              <h3>{t('landing.step3Title')}</h3>
              <p>{t('landing.step3Desc')}</p>
            </article>
            <article>
              <strong>04</strong>
              <h3>{t('landing.step4Title')}</h3>
              <p>{t('landing.step4Desc')}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="clinic-gallery">
        <div className="container">
          <h2>{t('landing.galleryTitle')}</h2>
          <div className="gallery-grid">
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
              alt={t('landing.galleryTitle')}
              onError={withFallback(t('landing.galleryTitle'), '#0f4c81')}
            />
            <img
              src="https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?auto=format&fit=crop&w=1200&q=80"
              alt={t('landing.clinicalContext')}
              onError={withFallback(t('landing.clinicalContext'), '#1a6ca8')}
            />
            <img
              src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80"
              alt={t('landing.servicesTitle')}
              onError={withFallback(t('landing.servicesTitle'), '#205f94')}
            />
          </div>
        </div>
      </section>

      <section className="services">
        <div className="container">
          <h2>{t('landing.servicesTitle')}</h2>
          <div className="service-tiles">
            <div className="service-tile">
              <img
                src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80"
                alt={t('landing.generalDentistry')}
                onError={withFallback(t('landing.generalDentistry'), '#0f4c81')}
              />
              <div className="service-body">
                <h3>{t('landing.generalDentistry')}</h3>
                <p>{t('landing.generalDentistryDesc')}</p>
              </div>
            </div>
            <div className="service-tile">
              <img
                src="https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=1200&q=80"
                alt={t('landing.cosmeticDentistry')}
                onError={withFallback(t('landing.cosmeticDentistry'), '#0d5f98')}
              />
              <div className="service-body">
                <h3>{t('landing.cosmeticDentistry')}</h3>
                <p>{t('landing.cosmeticDentistryDesc')}</p>
              </div>
            </div>
            <div className="service-tile">
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80"
                alt={t('landing.orthodontics')}
                onError={withFallback(t('landing.orthodontics'), '#165f95')}
              />
              <div className="service-body">
                <h3>{t('landing.orthodontics')}</h3>
                <p>{t('landing.orthodonticsDesc')}</p>
              </div>
            </div>
            <div className="service-tile">
              <img
                src={oralSurgeryImage}
                alt={t('landing.oralSurgery')}
                onError={withFallback(t('landing.oralSurgery'), '#134f81')}
              />
              <div className="service-body">
                <h3>{t('landing.oralSurgery')}</h3>
                <p>{t('landing.oralSurgeryDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>{t('landing.ctaTitle')}</h2>
          <p>{t('landing.ctaSubtitle', { clinicName })}</p>
          <Link to="/patient-workspace/book" className="btn btn-primary btn-large">
            {t('landing.scheduleNow')}
          </Link>
        </div>
      </section>

      <section className="location-contact">
        <div className="container location-contact-grid">
          <div className="location-panel">
            <h2>{t('landing.visitTitle', { clinicName })}</h2>
            <p>{t('landing.address')}</p>
            <p>{t('landing.hoursDetail')}</p>
            <p>{t('landing.phoneEmail')}</p>
            <iframe
              title={t('landing.visitTitle', { clinicName })}
              src="https://www.google.com/maps?q=dental%20clinic&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <form className="contact-panel" onSubmit={(e) => e.preventDefault()}>
            <h3>{t('landing.quickContact')}</h3>
            <p>{t('landing.quickContactDesc')}</p>
            <input type="text" placeholder={t('landing.fullName')} />
            <input type="tel" placeholder={t('landing.phoneNumber')} />
            <input type="email" placeholder={t('landing.emailAddress')} />
            <textarea rows="4" placeholder={t('landing.howCanWeHelp')} />
            <button type="submit" className="btn btn-primary">{t('landing.sendRequest')}</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>{clinicName}</h4>
              <p>{t('landing.trustedPartner')}</p>
            </div>
            <div className="footer-section">
              <h4>{t('common.hours')}</h4>
              <p>{t('landing.hoursMondayFriday')}</p>
              <p>{t('landing.hoursSaturdayDetail')}</p>
              <p>{t('landing.sundayClosed')}</p>
            </div>
            <div className="footer-section">
              <h4>{t('common.contact')}</h4>
              <p>Phone: (555) 123-4567</p>
              <p>Email: hello@dentalclinic.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t('landing.allRights', { clinicName })}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
