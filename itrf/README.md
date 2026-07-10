# Income Tax Filed Return Form (ITRF)

BC Ministry of Health — Income Tax Filed Return Form application. Allows BC residents to submit income tax return information for Fair PharmaCare.

**Deployed at:** https://my.gov.bc.ca/itrf/

---

## Prerequisites

- **Node.js** 18 or later (LTS recommended)

No global CLI tools required — all tooling runs via `npm run`.

---

## Installation

```bash
git clone https://github.com/bcgov/MOH-FPC-Enrolment
cd MOH-FPC-Enrolment/itrf
npm install
```

---

## Running the Dev Server

```bash
npm run dev
```

The app is served at **http://localhost:5173/itrf/**

The dev server proxies API calls (`/itrf/api`) to the dev OpenShift environment. To point at a different backend, update the `target` URL in `vite.config.js` under `server.proxy`.

### Dev settings

`src/settings.js` contains flags for local development:

| Setting | Default | Description |
|---|---|---|
| `bypassRouteGuards` | `false` | Skip page-order navigation guards (jump to any page directly) |
| `useDummyData` | `false` | Pre-fill forms with dummy data for faster testing |

---

## Building

**Development build:**
```bash
vite build
```

**Production build** (same command — Vite uses `NODE_ENV=production` automatically):
```bash
npm run build
```

Output is written to `dist/`.

**Preview the production build locally:**
```bash
npm run preview
```

---

## Testing

### Unit tests

Unit tests run with **Vitest**. Test files live in `tests/unit/`.

**Run in watch mode (re-runs on file changes):**
```bash
npm run test:unit
```

**Run once (CI mode, exits after results):**
```bash
npx vitest run
```

**Run with coverage report:**
```bash
npx vitest run --coverage
```

### End-to-end tests

E2E tests use **Cypress**. The dev server must be running (`npm run dev`) before launching Cypress.

**Open Cypress UI (interactive, recommended for local development):**
```bash
npm run test:e2e
```

**Run headless (CI mode):**
```bash
npm run test:e2e-headless
```

Cypress configuration is in `cypress.config.js`. E2E test files live in `cypress/e2e/`.

---

## Linting and Formatting

```bash
npm run lint      # ESLint (auto-fixes .js and .vue files)
npm run format    # Prettier (formats all files)
```

On commit, **Husky + lint-staged** automatically runs ESLint and Prettier on staged `src/` files.

---

## Maintenance Mode / Splash Page

The splash page is controlled via OpenShift environment variables on the `spa-env-server` pod.

**To enable maintenance mode:**

1. Go to the target OpenShift environment (dev / test / prod)
2. Navigate to: Applications → Deployments → `spa-env-server` → Environment tab
3. Set the following variables:

| Variable | Description |
|---|---|
| `SPA_ENV_ITRF_MAINTENANCE_FLAG` | Set to `true` to force maintenance mode on immediately |
| `SPA_ENV_ITRF_MAINTENANCE_START` | Start time for scheduled maintenance window |
| `SPA_ENV_ITRF_MAINTENANCE_END` | End time for scheduled maintenance window |
| `SPA_ENV_ITRF_MAINTENANCE_MESSAGE` | Optional custom message shown below the default splash |

`spa-env-server` automatically activates maintenance mode between the start and end times. `MAINTENANCE_FLAG` can also be set to `true` to enable it immediately outside of a scheduled window.

---

## Application Details

### Tech Stack

- **Vue 3** with `<script setup>` SFCs
- **Vue Router 4** — client-side routing
- **Vuex 4** — state management
- **Vite 5** — build tool and dev server
- **Vuelidate 2** — form validation
- **axios** — HTTP client
- **maska** — input masking
- **date-fns 2** — date utilities
- **Font Awesome 5** — icons
- **Sass** — stylesheet preprocessing

### Pages

| Route | Page | Description |
|---|---|---|
| `/` | Get Started | Entry page |
| `/personal-info` | Personal Information | Applicant details form |
| `/submission` | Submission | Review and submit |
| `/submission-error` | Submission Error | Error fallback page |
| `/maintenance` | Maintenance | Splash page shown during downtime |

### Project Structure

```
src/
  assets/          # Static assets
  components/      # Shared Vue components
  constants/       # App-wide constants
  fonts/           # Local fonts
  helpers/         # Utility functions
  images/          # Image assets
  mixins/          # Vue mixins
  router/          # Vue Router config and route definitions
  services/        # API and environment services
  store/           # Vuex store (state, mutations, actions)
  styles/          # Global SCSS
  views/           # Page-level components
  main.js          # App entry point
  settings.js      # Local dev flags
```

### Path Alias

`@` resolves to `src/` throughout the project (configured in `vite.config.js`).

### API Proxy (local dev)

`vite.config.js` proxies `/itrf/api` to the dev OpenShift backend. Update the `target` URL to point at a different environment.
