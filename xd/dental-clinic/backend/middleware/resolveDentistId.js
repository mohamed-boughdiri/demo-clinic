/** Dentist id for doctor routes — practice-owner admins use linked dentistId from JWT. */
export function resolveDentistId(req) {
  return req.dentistId || req.userId;
}
