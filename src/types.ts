export type RaceCategory = '' | '10k' | '5k-fun-run';

export const RACE_CATEGORIES: { value: RaceCategory; label: string; distance: string; fee?: number }[] = [
  { value: '10k', label: '10KM Competitive Run', distance: '10 KM', fee: 300 },
  { value: '5k-fun-run', label: '5KM Fun Run & Walk', distance: '5 KM', fee: 250 },
];

export type Gender = '' | 'male' | 'female';
export type AgeRange = '' | 'Under 18' | '18-29' | '30-39' | '40-49' | '50-59' | '60+';
export type TShirtSize = '' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | '4XL' | '5XL';
export type PaymentMethod = 'mobile-money' | 'card';
export type MobileMoneyProvider = '' | 'MTN_MONEY' | 'AIRTEL_MONEY' | 'ZAMTEL_KWACHA';
export type RegistrationStatus = 'confirmed' | 'pending-bank-transfer' | 'processing' | 'failed';

export interface RegistrationDetails {
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  ageRange: AgeRange;
  country: string;
  tShirtSize: TShirtSize;
  raceCategory: RaceCategory;
  clubOrInstitution: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalNotes: string;
  acceptedTerms: boolean;
}

export interface PaymentInfo {
  method: PaymentMethod;
  provider?: MobileMoneyProvider;
  phoneNumber?: string;
  city?: string;
  address?: string;
  zipCode?: string;
}

export interface RegistrationRecord {
  reference: string;
  details: RegistrationDetails;
  payment: PaymentInfo;
  status: RegistrationStatus;
  submittedAt: string;
  amount?: number | null;
  currency?: string;
}

/** A mobile money or card payment that's been sent to the payment gateway
 * and is waiting on an outcome — tracked separately from `record` because
 * the registration isn't "done" yet at this point. For card payments the
 * browser navigates away to the gateway's hosted checkout and back, so this
 * (like the rest of registration state) is persisted to localStorage —
 * see store.ts — and resumed on return. */
export interface PendingPayment {
  paymentId: string;
  registrationId: string;
  reference: string;
  email: string;
  amount: number | null;
  currency: string;
  method: 'mobile-money' | 'card';
  phoneNumber: string;
  provider: MobileMoneyProvider;
}

export type Step = 'details' | 'payment' | 'processing' | 'done';
