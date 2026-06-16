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
