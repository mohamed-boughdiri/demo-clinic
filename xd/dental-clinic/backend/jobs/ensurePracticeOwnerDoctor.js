import User from '../models/User.js';
import Dentist from '../models/Dentist.js';
import { getClinicName, isSingleDoctorMode } from '../config/clinic.js';

const publicDentistFields =
  'fullName specialty clinicName experienceYears achievements education about currentFocus currentStatus';

/** The one doctor for a solo practice (admin-linked profile, or oldest record). */
export async function getPracticeDentist() {
  const admin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
  if (admin) {
    const linked = await Dentist.findOne({ email: admin.email }).select(publicDentistFields);
    if (linked) return linked;
  }
  return Dentist.findOne({}).sort({ createdAt: 1 }).select(publicDentistFields);
}
/**
 * Solo practice: the admin is also the doctor (one login).
 * Ensures the primary admin has a linked Dentist profile with the same email.
 */
export async function ensurePracticeOwnerDoctor() {
  if (!isSingleDoctorMode()) {
    return;
  }

  try {
    const admin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
    if (!admin) {
      return;
    }

    const existing = await Dentist.findOne({ email: admin.email });
    if (existing) {
      console.log('[bootstrap] Practice owner doctor profile linked:', admin.email);
      return;
    }

    const fullName = `Dr. ${admin.firstName} ${admin.lastName}`.trim();

    await Dentist.create({
      fullName,
      email: admin.email,
      // Login always goes through the User (admin) account — this password is not used.
      password: `linked-${admin._id}-${Date.now()}`,
      phone: admin.phone || '0000000000',
      clinicName: getClinicName(),
      specialty: process.env.DEFAULT_DOCTOR_SPECIALTY || 'General Dentistry',
      licenseNumber: process.env.DEFAULT_DOCTOR_LICENSE || 'DEV-LICENSE-001',
      experienceYears: 1,
      about: '',
      currentFocus: 'Consultations and patient care',
    });

    console.log('[bootstrap] Practice owner doctor profile created for admin:', admin.email);
    console.log('[bootstrap] Sign in once as admin — you also get the doctor schedule.');
  } catch (err) {
    console.error('[bootstrap] Could not link practice owner doctor profile:', err.message);
  }
}
