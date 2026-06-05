import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getActiveLocale } from '../i18n'
import '../styles/CalendarPicker.css'

const pad2 = (n) => String(n).padStart(2, '0')
const toKey = (date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1)
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)

const CalendarPicker = ({
  monthDate,
  availableDates = [],
  selectedDate,
  onSelect,
  title,
  dateBadges = {},
  badgeAriaLabel,
}) => {
  const { t } = useTranslation()
  const availableSet = useMemo(() => new Set(availableDates), [availableDates])

  const weekdays = [
    t('calendar.mon'),
    t('calendar.tue'),
    t('calendar.wed'),
    t('calendar.thu'),
    t('calendar.fri'),
    t('calendar.sat'),
    t('calendar.sun'),
  ]

  const grid = useMemo(() => {
    const start = startOfMonth(monthDate)
    const end = endOfMonth(monthDate)

    const firstDayIndex = (start.getDay() + 6) % 7
    const daysInMonth = end.getDate()

    const cells = []
    for (let i = 0; i < firstDayIndex; i += 1) {
      cells.push({ type: 'empty', key: `e-${i}` })
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), d)
      const key = toKey(date)
      const badge = dateBadges[key]
      cells.push({
        type: 'day',
        key,
        label: d,
        dateKey: key,
        isAvailable: availableSet.has(key),
        isSelected: key === selectedDate,
        badge,
      })
    }
    return cells
  }, [availableSet, dateBadges, monthDate, selectedDate])

  const monthLabel = monthDate.toLocaleDateString(getActiveLocale(), {
    year: 'numeric',
    month: 'long',
  })

  const resolvedTitle = title ?? t('calendar.selectDate')
  const resolvedBadgeAria =
    badgeAriaLabel ||
    ((dateKey, badgeText) => t('calendar.badgeAria', { date: dateKey, count: badgeText }))

  return (
    <div className="calendar-picker">
      <div className="calendar-header">
        <div>
          <div className="calendar-title">{resolvedTitle}</div>
          <div className="calendar-month">{monthLabel}</div>
        </div>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map((w) => (
          <div className="weekday" key={w}>
            {w}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {grid.map((cell) =>
          cell.type === 'empty' ? (
            <div className="calendar-cell empty" key={cell.key} />
          ) : (
            <button
              key={cell.key}
              type="button"
              className={`calendar-cell day ${cell.isAvailable ? 'available' : 'disabled'} ${
                cell.isSelected ? 'selected' : ''
              } ${cell.badge ? 'has-badge' : ''}`}
              onClick={() => cell.isAvailable && onSelect?.(cell.dateKey)}
              disabled={!cell.isAvailable}
              aria-label={`${t('calendar.selectDate')} ${cell.dateKey}`}
            >
              <span className="day-number">{cell.label}</span>
              {cell.badge ? (
                <span
                  className={`day-indicator ${cell.badge.variant || 'neutral'}`}
                  aria-label={resolvedBadgeAria(cell.dateKey, cell.badge.text)}
                />
              ) : null}
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default CalendarPicker
