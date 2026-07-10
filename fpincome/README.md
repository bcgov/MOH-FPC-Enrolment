# Fair PharmaCare Income Review (FPIncome)

![img](https://img.shields.io/badge/Lifecycle-Maturing-007EC6)

BC Ministry of Health — Fair PharmaCare Income Review application. Allows BC residents to submit income review applications for PharmaCare.

---

## Prerequisites

- **Node.js** 10 or later (LTS 14 or 16 recommended for Angular 8 compatibility)
- **Angular CLI 8** — install globally:
  ```bash
  npm install -g @angular/cli@8
  ```
- **Google Chrome** — required for running unit tests locally

Verify with `ng version`.

---

## Installation

```bash
git clone https://github.com/bcgov/MOH-FPC-Enrolment
cd MOH-FPC-Enrolment/fpincome
npm install
```

---

## Running the Dev Server

```bash
npm start
# or
ng serve
# or (exposes on all interfaces and opens browser)
npm run dev
```

The app is served at **http://localhost:4310/**

The dev server proxies API calls to the dev OpenShift environment via `src/proxy.conf.json`. To point at a different backend, update the `target` URL in that file.

---

## Building

**Development build:**
```bash
ng build
```

**Production build:**
```bash
npm run build
# runs: ng build --prod
```

> The `prebuild` hook automatically runs `node src/version.js` to stamp the current version into the bundle before every build.

Output is written to `dist/`.

---

## Testing

Tests run with **Karma + Jasmine**. Google Chrome must be installed and on your `PATH`.

### Unit tests

**Run in watch mode (re-runs on file changes, opens browser):**
```bash
npm test
# or
ng test
```

**Run once with coverage (headless Chrome, no watch):**
```bash
npm run test:coverage
```

Coverage output is written to `coverage/`.

**Run once with headless Firefox:**
```bash
npm run test-headless-firefox
```

### End-to-end tests

E2E tests use **Protractor** with Chrome.

```bash
npm run e2e
```

> **Note:** The `pree2e` hook pins Chrome WebDriver to version 88. If your installed Chrome version differs, update the version string in the `pree2e` script in `package.json` before running.

---

## Linting

```bash
npm run lint
# or
ng lint
```

Lint rules are defined in `tslint.json`.

---

## Maintenance Mode / Splash Page

The splash page is controlled via OpenShift environment variables on the `spa-env-server` pod.

**To enable maintenance mode:**

1. Go to the target OpenShift environment (dev / test / prod)
2. Navigate to: Applications → Deployments → `spa-env-server` → Environment tab
3. Set the following variables:

| Variable | Description |
|---|---|
| `SPA_ENV_FPIR_MAINTENANCE_FLAG` | Set to `true` to force maintenance mode on immediately |
| `SPA_ENV_FPIR_MAINTENANCE_START` | Start time for scheduled maintenance window |
| `SPA_ENV_FPIR_MAINTENANCE_END` | End time for scheduled maintenance window |
| `SPA_ENV_FPIR_MAINTENANCE_MESSAGE` | Optional custom message shown below the default splash |

`spa-env-server` automatically activates maintenance mode between the start and end times. `MAINTENANCE_FLAG` can also be set to `true` to enable it immediately outside of a scheduled window.

---

## Versioning and Deployments

Before deploying to TEST or PROD, bump the version using one of:

```bash
npm run test-version   # increments minor: 0.1.0 → 0.2.0
npm run prod-version   # increments major: 1.0.0 → 2.0.0
```

These commands automatically increment the version in `package.json`, regenerate `CHANGELOG.md`, commit the changes, and create a git tag. Run them with a **clean working directory** (no uncommitted changes).

Then push the tags:
```bash
npm run push-version
# or
git push --follow-tags
```

Version scheme (not semver):
- Test releases: minor version (`0.1.0`, `0.2.0`, ...)
- Prod releases: major version (`1.0.0`, `2.0.0`, ...)

---

## Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/). See `CONTRIBUTING.md` for the full format. Summary:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

The changelog is generated from commit history via:
```bash
npm run changelog
```

---

## Application Details

### Tech Stack

- **Angular 8** (`~8.2.14`)
- **Bootstrap 4** with BC Government theme (`mygovbc-bootstrap-theme`)
- **ngx-bootstrap 5** — modals and UI components
- **angular2-text-mask** — input masking
- **moh-common-lib 4** — shared BC MoH component library
- **date-fns 2** — date utilities
- **moment 2** — date formatting

### App Structure

```
src/app/
  income-review/       # Main feature module (pages, components, models, services)
  services/            # App-level services
  splash-page/         # Maintenance/splash page
  app.constants.ts     # Route constants, SPA env config keys
  app-routing.module.ts
```

The main application route is `/application`.

### API Proxy (local dev)

`src/proxy.conf.json` proxies `/fpincome/api/` to the dev OpenShift backend. Update the `target` URL to point at a different environment.

### Environments

- `src/environments/environment.ts` — development
- `src/environments/environment.prod.ts` — production (used by `ng build --prod`)
