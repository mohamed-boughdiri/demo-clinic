import React from 'react'
import { useTranslation } from 'react-i18next'
import { supportedLanguages } from '../i18n'
import '../styles/LanguageSwitcher.css'

export default function LanguageSwitcher({ compact = false }) {
  const { i18n, t } = useTranslation()

  return (
    <div className={`language-switcher ${compact ? 'language-switcher--compact' : ''}`}>
      <label htmlFor="language-select" className="language-switcher__label">
        {t('common.language')}
      </label>
      <select
        id="language-select"
        className="language-switcher__select"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        aria-label={t('common.language')}
      >
        {supportedLanguages.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
