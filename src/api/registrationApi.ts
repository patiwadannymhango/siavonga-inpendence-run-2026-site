import type { RegistrationDetails, RegistrationRecord } from '../types';
import { RACE_CATEGORIES } from '../types';

/**
 * ---------------------------------------------------------------------------
 * FRONTEND-ONLY PLACEHOLDER — no backend exists for this event yet.
 * ---------------------------------------------------------------------------
 * Every function below keeps the same name/signature it would have once a
 * real backend is wired up, but none of them make a network call — they
 * resolve from local data (RACE_CATEGORIES, in-memory timers, localStorage
 * via the redux store) so the site works end-to-end with nothing behind it.
 *
 * TODO(backend): once an API exists, replace each function body with a
 * `fetch()` against it (see registrationApi.ts in the copperbelt-marathon
 * template for a worked example of this same interface talking to a real
 * Django backend) and drop the simulated delays/local ID generation below.
 * ---------------------------------------------------------------------------
 */

export interface BackendCategory {
  id: string;
  name: string;
  code: string;
  price: string | number;
  currency: string;
}

const LOCAL_CATEGORIES: BackendCategory[] = RACE_CATEGORIES.filter((c) => c.value).map((c) => ({
  id: c.value,
  name: c.label,
  code: c.value,
  price: c.fee ?? 0,
  currency: 'ZMW',
}));

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Fetch every race category with its fee — used by the Home and Races
 * pages. Resolves instantly from local data since fees are fixed and known
 * ahead of the backend existing.
 */
export async function fetchRaceCategories(): Promise<BackendCategory[]> {
  return LOCAL_CATEGORIES;
}

/** Fetch the entry fee for a single race category. */
export async function fetchRaceFee(categoryValue: string): Promise<number | null> {
  const category = LOCAL_CATEGORIES.find((c) => c.code === categoryValue);
  if (!category) return null;
  const price = Number(category.price);
  return price > 0 ? price : null;
}

export interface SubmitRegistrationResult {
  registrationId: string;
  reference: string;
  amount: number | null;
  currency: string;
}

let refCounter = 0;

function generateReference(): string {
  refCounter += 1;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SIR-${random}${refCounter}`;
}

/** Step 1 of checkout: "creates" the registration locally (no payment yet). */
export async function submitRegistrationDetails(
  details: RegistrationDetails
): Promise<SubmitRegistrationResult> {
  const category = LOCAL_CATEGORIES.find((c) => c.code === details.raceCategory);
  if (!category) {
    throw new Error('Unknown race category — please reselect and try again.');
  }

  const price = Number(category.price);
  return delay({
    registrationId: `local-${Date.now()}`,
    reference: generateReference(),
    amount: price > 0 ? price : null,
    currency: category.currency,
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
  /** Card only — where a real gateway's hosted checkout would send the
   * browser. Left blank here since there's no gateway behind this yet. */
  redirectUrl: string;
}

const pendingSince = new Map<string, number>();
const SIMULATED_SETTLE_MS = 4000;

/** Step 2 of checkout: starts payment on an already-created registration. */
export async function initiatePayment(
  params: InitiatePaymentParams
): Promise<InitiatePaymentResult> {
  const paymentId = `local-pay-${Date.now()}`;
  pendingSince.set(paymentId, Date.now());
  void params;
  return delay({ paymentId, status: 'PROCESSING', redirectUrl: '' });
}

export interface PaymentStatusResult {
  status: string;
  registrationStatus: string;
}

/** Polled by the "check your phone" screen. Settles to SUCCESS a few
 * seconds after initiation so the full flow demoes end-to-end. */
export async function checkPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
  const startedAt = pendingSince.get(paymentId) ?? Date.now();
  const settled = Date.now() - startedAt >= SIMULATED_SETTLE_MS;
  return delay(
    {
      status: settled ? 'SUCCESS' : 'PROCESSING',
      registrationStatus: settled ? 'CONFIRMED' : 'PENDING',
    },
    300
  );
}

/** Looks up a registration by reference or email among records submitted
 * in this browser session — there's nowhere else to look without a
 * backend yet. */
export async function searchRegistration(
  query: string,
  localRecords: RegistrationRecord[]
): Promise<RegistrationRecord | null> {
  const q = query.trim().toLowerCase();
  const match = localRecords.find(
    (r) => r.reference.toLowerCase() === q || r.details.email.toLowerCase() === q
  );
  return delay(match ?? null, 300);
}
