// Typed wrapper for PasalaPro API calls.
// All requests go to NEXT_PUBLIC_PASALAPRO_API_URL (no Stripe keys here).
//
// NEXT_PUBLIC_PASALAPRO_API_URL must be set per environment in Vercel:
//   Production : https://pasalapro.com
//   Preview    : https://pasalapro-git-dev-bladimirs-projects-10100b21.vercel.app
//   Local dev  : http://localhost:3000

function getBase(): string {
  const raw = process.env.NEXT_PUBLIC_PASALAPRO_API_URL;
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_PASALAPRO_API_URL is not configured. " +
      "Set it in .env.local (local dev) or Vercel project settings (preview/production)."
    );
  }
  return raw.replace(/\/$/, "");
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
  language: "en" | "es";
  jerseySize: string;
  displayName: string;
  isPublic: boolean;
  paymentPlan: "full" | "installments";
  depositAmountCents?: number;
  installmentCount?: number;
  termsAcceptedAt: string; // ISO timestamp
  termsVersion: string;
}

export interface CreateOrderResult {
  ok: true;
  orderId: string;
  publicAccessToken: string;
}

export interface CreateCheckoutPayload {
  paymentType: "full" | "deposit" | "installment";
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutResult {
  ok: true;
  url: string;
  feeBreakdown: {
    netCents: number;
    feeCents: number;
    grossCents: number;
  };
}

export interface PublicOrder {
  _id: string;
  status: string;
  code: string | null;
  number: number | null;
  firstName: string;
  lastName: string;
  displayName: string;
  isPublic: boolean;
  jerseySize: string;
  paymentPlan: string;
  totalAmountCents: number;
  amountPaidCents: number;
  balanceRemainingCents: number;
  deliveryStatus?: string;
  assignedAt?: string | null;
  collection?: string;
  language?: string;
  nextPaymentDueAt?: string | null;
}

export interface OrderBySessionResult {
  ok: true;
  order: PublicOrder & { publicAccessToken: string };
}

export interface OrderStatusResult {
  ok: true;
  order: PublicOrder;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${getBase()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    const msg =
      json.error ||
      (json.errors ? JSON.stringify(json.errors) : "Unknown error");
    throw new Error(msg);
  }
  return json as T;
}

// ── API calls ─────────────────────────────────────────────────────────────────

/**
 * POST /api/harpia/founders/orders
 * Creates a new order (no payment). Returns orderId + publicAccessToken.
 */
export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResult> {
  return apiFetch<CreateOrderResult>(
    "/api/harpia/founders/orders",
    { method: "POST", body: JSON.stringify(payload) }
  );
}

/**
 * POST /api/harpia/founders/orders/[orderId]/checkout
 * Creates a Stripe Checkout session. Returns the redirect URL.
 */
export async function createCheckoutSession(
  orderId: string,
  payload: CreateCheckoutPayload
): Promise<CreateCheckoutResult> {
  return apiFetch<CreateCheckoutResult>(
    `/api/harpia/founders/orders/${orderId}/checkout`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

/**
 * GET /api/harpia/founders/orders/by-session?session_id=
 * Retrieves order (including publicAccessToken) by Stripe session ID.
 * Used once on the success page after Stripe redirect.
 */
export async function getOrderBySession(
  sessionId: string
): Promise<OrderBySessionResult> {
  return apiFetch<OrderBySessionResult>(
    `/api/harpia/founders/orders/by-session?session_id=${encodeURIComponent(sessionId)}`
  );
}

/**
 * GET /api/harpia/founders/orders/[orderId]/public-status?token=
 * Safe public polling — no PII, no Stripe IDs.
 */
export async function getOrderStatus(
  orderId: string,
  token: string
): Promise<OrderStatusResult> {
  return apiFetch<OrderStatusResult>(
    `/api/harpia/founders/orders/${orderId}/public-status?token=${encodeURIComponent(token)}`
  );
}
