# MOH-FPC-Enrolment

BC Ministry of Health — Fair PharmaCare Enrolment monorepo.

This repository contains the frontend applications and backend microservices that make up the Fair PharmaCare family of online services, deployed on OpenShift (Silver cluster).

---

## Applications

| Directory | Name | Stack | Description |
|---|---|---|---|
| [`fpcare/`](fpcare/README.md) | Fair PharmaCare | Angular 19 | Registration and status check for PharmaCare |
| [`fpincome/`](fpincome/README.md) | FPC Income Review | Angular 8 | Income review application for PharmaCare |
| [`itrf/`](itrf/README.md) | Income Tax Filed Return | Vue 3 + Vite | Submit income tax return information for PharmaCare |

## Backend Services

| Directory | Name | Description |
|---|---|---|
| [`address-service/`](address-service/README.md) | Address Service | Proxy to the BC OLS geocoding/address validation service |
| [`cache-service/`](cache-service/) | Cache Service | Caching layer for backend API responses |
| [`captcha-service/`](captcha-service/README.md) | CAPTCHA Service | CAPTCHA generation and JWT-based validation microservice |
| [`msp-service/`](msp-service/README.md) | MSP Service | Static proxy to the MSP backend with authentication |
| [`spa-env-server/`](spa-env-server/README.md) | SPA Env Server | Serves OpenShift environment variables (maintenance flags etc.) to SPAs at runtime |
| [`splunk-forwarder/`](splunk-forwarder/README.md) | Splunk Forwarder | Receives log events from SPAs and forwards them to the HIBC Splunk server |

All backend services are Node.js/Express applications that listen on port 8080 by default (`SERVICE_PORT` env var overrides this).

---

## Architecture Overview

```
Browser
  │
  ├── fpcare  (Angular 19, /fpcare/)
  ├── fpincome (Angular 8, /fpincome/)
  └── itrf    (Vue 3, /itrf/)
       │
       ├── /api/env         → spa-env-server   (maintenance flags, runtime config)
       ├── /api/captcha     → captcha-service   (CAPTCHA challenge + JWT verification)
       ├── /api/address     → address-service   (BC address geocoding/validation)
       ├── /api/           → msp-service        (MSP backend proxy)
       └── /log            → splunk-forwarder   (Splunk logging)
```

- **spa-env-server** is read by every SPA on startup to retrieve maintenance mode settings and other runtime configuration from OpenShift env vars.
- **captcha-service** issues a CAPTCHA challenge and returns a signed JWT on success; the JWT is included in form submissions for server-side verification.
- **cache-service** sits between the SPAs and slower backend APIs, reducing latency and load.

---

## Repository Structure

```
MOH-FPC-Enrolment/
  fpcare/             # Angular 19 SPA
  fpincome/           # Angular 8 SPA
  itrf/               # Vue 3 SPA
  address-service/    # Node.js address lookup proxy
  cache-service/      # Node.js caching service
  captcha-service/    # Node.js CAPTCHA microservice (TypeScript)
  msp-service/        # Node.js MSP proxy service
  spa-env-server/     # Node.js runtime env var server
  splunk-forwarder/   # Node.js Splunk log forwarder
  openshift/          # OpenShift deployment templates
  doc/                # Runbooks and environment setup guides
```

---

## Development

Each sub-project is independently installable and runnable. See the README in each directory for full setup instructions.

**Quick reference:**

| Project | Install | Dev server |
|---|---|---|
| `fpcare` | `npm install --legacy-peer-deps` + symlink restore | `ng serve` → http://localhost:4302/fpcare/ |
| `fpincome` | `npm install` | `ng serve` → http://localhost:4310/ |
| `itrf` | `npm install` | `npm run dev` → http://localhost:5173/itrf/ |
| Backend services | `npm install` | `npm run dev` → http://localhost:8080/ |

All frontend dev servers proxy their `/api` calls to the dev OpenShift environment by default. See each project's proxy config to point at a different backend.

---

## Documentation

Runbooks and environment setup guides are in [`doc/`](doc/):

- `SetupDevEnvironment.md` — local development setup
- `SetupTestEnvironment.md` — test environment
- `SetupProdEnvironment.md` — production environment
- `SetupToolsEnvironment.md` — CI/CD tools setup
- `RUNBOOK.md` — operational runbook

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Pull requests are welcome — fork the repo and submit a PR for review.

All contributions are licensed under the same terms as this project (Apache 2.0 — see [LICENSE](LICENSE)).
