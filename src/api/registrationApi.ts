import type { RegistrationDetails, RegistrationRecord } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001').replace(/\/$/, '');

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.detail || Object.values(body)[0]?.toString() || message;
    } catch {
      // response wasn't JSON — fall back to the generic message above
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export interface BackendCategory {
  id: string;
  name: string;
  code: string;
  price: string | number;
  currency: string;
}

/**
 * Fetch every race category with its fee — used by the Home and Races
 * pages.
 */
export async function fetchRaceCategories(): Promise<BackendCategory[]> {
  return apiFetch<BackendCategory[]>('/categories/');
}

/** Fetch the entry fee for a single race category. */
export async function fetchRaceFee(categoryValue: string): Promise<number | null> {
  const categories = await fetchRaceCategories();
  const category = categories.find((c) => c.code === categoryValue);
  if (!category) return null;
  const price = Number(category.price);
  return price > 0 ? price : null;
}

export interface SubmitRegistrationResult {
  registrationId: string;
  /** Not assigned yet — the backend only generates a reference once the
   * registration is confirmed (i.e. after payment succeeds). */
  reference: string | null;
  amount: number | null;
  currency: string;
}

/** Step 1 of checkout: creates the registration on the backend (no payment yet). */
export async function submitRegistrationDetails(
  details: RegistrationDetails
): Promise<SubmitRegistrationResult> {
  return apiFetch<SubmitRegistrationResult>('/registrations/', {
    method: 'POST',
    body: JSON.stringify(details),
  });
}

export interface InitiatePaymentParams {
  registrationId: string;
  paymentMethod: 'MTN_MONEY' | 'AIRTEL_MONEY' | 'ZAMTEL_KWACHA' | 'CARD';
  phoneNumber?: string;
  city?: string;
  address?: string;
  zipCode?: string;
  backUrl?: string;
}

export interface InitiatePaymentResult {
  paymentId: string;
  status: string;
  /** Card only — where the payment gateway's hosted checkout sends the
   * browser. Empty when the local "console" gateway is active. */
  redirectUrl: string;
}

/** Step 2 of checkout: starts payment on an already-created registration. */
export async function initiatePayment(
  params: InitiatePaymentParams
): Promise<InitiatePaymentResult> {
  return apiFetch<InitiatePaymentResult>('/payments/initiate/', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export interface PaymentStatusResult {
  status: string;
  registrationStatus: string;
  /** Set only once the registration reaches CONFIRMED — this is where
   * the frontend picks up the reference, since it doesn't exist yet at
   * registration-creation time. */
  reference: string | null;
}

/** Polled by the "check your phone" screen. */
export async function checkPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
  return apiFetch<PaymentStatusResult>(`/payments/${paymentId}/status/`);
}

/** Looks up a registration by reference or email. */
export async function searchRegistration(
  query: string,
  _localRecords: RegistrationRecord[]
): Promise<RegistrationRecord | null> {
  try {
    return await apiFetch<RegistrationRecord>(`/registrations/lookup/?q=${encodeURIComponent(query)}`);
  } catch {
    return null;
  }
}
