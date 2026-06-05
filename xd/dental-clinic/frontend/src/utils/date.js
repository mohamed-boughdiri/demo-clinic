import i18n from '../i18n'

const getLocale = () => {
  const map = { en: 'en-US', fr: 'fr-FR', ar: 'ar' }
  return map[i18n.language] || 'en-US'
}

export const formatDisplayDate = (dateString) => {
  if (!dateString) return i18n.t('common.notSet');
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return i18n.t('common.invalidDate');
  return date.toLocaleDateString(getLocale(), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDisplayDateTime = (dateString, time) => {
  const date = formatDisplayDate(dateString);
  if (!time) return date;
  return `${date} ${i18n.t('common.at')} ${time}`;
};

/** Parts for reception “calendar agenda” day headers. */
export const formatCalendarAgendaParts = (dateInput) => {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return null;
  return {
    dowShort: d.toLocaleDateString(getLocale(), { weekday: 'short' }),
    dowLong: d.toLocaleDateString(getLocale(), { weekday: 'long' }),
    dayNum: d.getDate(),
    monthShort: d.toLocaleDateString(getLocale(), { month: 'short' }),
    monthYear: d.toLocaleDateString(getLocale(), { month: 'long', year: 'numeric' }),
  };
};
