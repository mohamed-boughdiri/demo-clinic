/**
 * Single-practice configuration for this deployment.
 * Set CLINIC_NAME / CLINIC_TAGLINE in `.env` to customize branding.
 * Set SINGLE_DOCTOR_MODE=false to allow multiple doctors (large-clinic mode).
 */
export function getClinicName() {
  const name = process.env.CLINIC_NAME?.trim();
  return name && name.length > 0 ? name : 'Bright Smile Dental';
}

export function getClinicTagline() {
  const tagline = process.env.CLINIC_TAGLINE?.trim();
  return tagline && tagline.length > 0 ? tagline : 'Your trusted local dentist';
}

/** Default: one-doctor solo practice. Set SINGLE_DOCTOR_MODE=false for multi-doctor clinics. */
export function isSingleDoctorMode() {
  return process.env.SINGLE_DOCTOR_MODE !== 'false';
}
