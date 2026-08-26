/**
 * ---------------------------------------------------------------------------
 * VENDOR / EXHIBITOR REGISTRATION — a separate flow from runner
 * registration (its own categories, its own records on the backend), so
 * this is a parallel, self-contained API module rather than extending
 * registrationApi.ts — the two have nothing in common field-wise. Payment
 * initiation/status ARE shared with the runner flow on the backend (same
 * Lipila collection request under the hood), so this reuses those two
 * endpoints directly.
 * ---------------------------------------------------------------------------
 */

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

export interface VendorCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  price: string | number;
  currency: string;
  capacity: number | null;
}

export async function fetchVendorCategories(): Promise<VendorCategory[]> {
  return apiFetch<VendorCategory[]>('/vendors/categories/');
}

export interface VendorDetails {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessLocation: string;
  productsServices: string;
  category: string; // category code
  requirement: string;
}

export interface SubmitVendorResult {
  registrationId: string;
  reference: string | null;
  amount: number;
  currency: string;
  status: string;
}

/** Creates the vendor registration. If the chosen category is free (e.g.
 * Official Sponsor), the backend confirms it immediately — the caller
 * should check `status` and skip the payment step when it's already
 * "CONFIRMED". */
export async function submitVendorRegistration(details: VendorDetails): Promise<SubmitVendorResult> {
  return apiFetch<SubmitVendorResult>('/vendors/register/', {
    method: 'POST',
    body: JSON.stringify(details),
  });
}

export interface InitiateVendorPaymentParams {
  registrationId: string;
  paymentMethod: 'MTN_MONEY' | 'AIRTEL_MONEY' | 'ZAMTEL_KWACHA' | 'CARD';
  phoneNumber?: string;
  city?: string;
  address?: string;
  zipCode?: string;
  backUrl?: string;
}

export interface InitiateVendorPaymentResult {
  paymentId: string;
  status: string;
  redirectUrl: string;
}

/** Starts payment on an already-created vendor registration — the exact
 * same endpoint runner registration payments use; the backend figures out
 * which kind of registration the id belongs to. */
export async function initiateVendorPayment(
  params: InitiateVendorPaymentParams
): Promise<InitiateVendorPaymentResult> {
  return apiFetch<InitiateVendorPaymentResult>('/payments/initiate/', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export interface VendorPaymentStatusResult {
  status: string;
  registrationStatus: string;
  reference: string | null;
}

export async function checkVendorPaymentStatus(paymentId: string): Promise<VendorPaymentStatusResult> {
  return apiFetch<VendorPaymentStatusResult>(`/payments/${paymentId}/status/`);
}
