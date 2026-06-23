@AGENTS.md

## Environment variables — PasalaPro backend

HarpiaFC is a frontend-only app. All founder order/checkout/payment logic lives
in PasalaPro. The following env vars must be set **per environment** in Vercel
project settings (and in local .env files for dev).

### `NEXT_PUBLIC_PASALAPRO_API_URL`
Base URL of the PasalaPro backend. Baked into the client bundle at build time.
**HarpiaFC must be redeployed whenever this changes.**

### `PASALAPRO_REGISTRY_API_URL`
Full URL of the PasalaPro registry endpoint used by the server-side proxy at
`/api/fundadores/registry`. Server-only — not exposed to the client. If omitted,
the proxy derives it as `${NEXT_PUBLIC_PASALAPRO_API_URL}/api/harpia/founders/registry`.

---

### Vercel project settings

**Production** (`harpiafc.com`, `www.harpiafc.com`)
```
NEXT_PUBLIC_PASALAPRO_API_URL=https://pasalapro.com
PASALAPRO_REGISTRY_API_URL=https://pasalapro.com/api/harpia/founders/registry
```

**Preview** (HarpiaFC `dev` branch on Vercel)
```
NEXT_PUBLIC_PASALAPRO_API_URL=https://pasalapro-git-dev-bladimirs-projects-10100b21.vercel.app
PASALAPRO_REGISTRY_API_URL=https://pasalapro-git-dev-bladimirs-projects-10100b21.vercel.app/api/harpia/founders/registry
```

**Local development** (`.env.local`)
```
NEXT_PUBLIC_PASALAPRO_API_URL=http://localhost:3000
PASALAPRO_REGISTRY_API_URL=http://localhost:3000/api/harpia/founders/registry
```

> **Important:** `NEXT_PUBLIC_*` vars are baked into the JS bundle at build time.
> Changing them in Vercel and redeploying is sufficient — no code change needed.

---

## Authentication (account creation + login)

HarpiaFC has account signup/login/logout and a protected `/account` page.
PásalaPro remains the **single source of truth** — it owns Firebase auth and the
MongoDB `User` record. There is **no separate Harpia user database**.

### Architecture — backend proxy + httpOnly cookie

Because HarpiaFC (`harpiafc.com`) and PásalaPro (`pasalapro.com`) are different
domains, the PásalaPro session cookie cannot be shared. Instead:

```
Browser → harpiafc.com/api/auth/{signup,login}  (same-origin proxy)
        → PásalaPro /api/harpia/auth/{signup,login}  (Firebase + Mongo)
        ← { idToken, refreshToken, expiresIn, user }
HarpiaFC sets its own httpOnly cookie  →  Set-Cookie: hf_session
```

- **Firebase stays server-side only.** Firebase tokens live inside the httpOnly
  `hf_session` cookie and are never exposed to the Harpia browser. No Firebase
  Client SDK is used in HarpiaFC.
- `app/api/auth/*` are the HarpiaFC proxy routes; `app/lib/serverAuth.ts` holds
  the cookie/session helpers (server-only — do not import from client code).
- `app/context/AuthContext.tsx` is the client auth state; it only ever calls the
  same-origin `/api/auth/*` routes.
- `GET /api/auth/me` transparently refreshes an expiring idToken via PásalaPro
  and re-stores the rotated tokens in the cookie.

### PásalaPro endpoints consumed (added on the backend)

```
POST /api/harpia/auth/signup   { firstName, lastName, email, password }
POST /api/harpia/auth/login    { email, password }
GET  /api/harpia/auth/me       (Authorization: Bearer <idToken>)
POST /api/harpia/auth/refresh  { refreshToken }
```

New HarpiaFC accounts are created with `source = "harpiafc"` on the PásalaPro
`User` model.

### Env vars

No new HarpiaFC env var is required — the auth proxy uses the existing
`NEXT_PUBLIC_PASALAPRO_API_URL` as its server-side base URL. Optionally,
`PASALAPRO_API_URL` (server-only) can override the base used by `/api/auth/*`.

On **PásalaPro**, the auth endpoints reuse the existing
`NEXT_PUBLIC_FIREBASE_API_KEY` (Firebase Web API key) for the Firebase Auth REST
API, plus the existing `FIREBASE_*` Admin credentials and `MONGODB_URI`.
