# Fair PharmaCare (FPCare)

BC Ministry of Health — Fair PharmaCare enrolment web application. Allows BC residents to register for PharmaCare and check their registration status.

**Deployed at:** https://my.gov.bc.ca/fpcare

---

## Prerequisites

- **Node.js** 20 or later (use [nvm](https://github.com/nvm-sh/nvm) to manage versions)
- **Angular CLI 19** — install globally:
  ```bash
  npm install -g @angular/cli@19
  ```

Verify with `ng version`.

---

## Installation

Clone and install dependencies:

```bash
git clone https://github.com/bcgov/MOH-FPC-Enrolment
cd MOH-FPC-Enrolment/fpcare
npm install --legacy-peer-deps
```

> **`--legacy-peer-deps` is required.** The project has peer dependency constraints from the Angular 19 upgrade that need this flag.

### Restoring symlinks after `npm install`

`moh-common-lib-angular` is linked from a local source repo. Every `npm install` wipes the symlinks — they must be restored manually:

```bash
# 1. Point moh-common-lib-angular to the local source repo
rm -rf node_modules/moh-common-lib-angular
ln -s /path/to/moh-common-lib-angular node_modules/moh-common-lib-angular

# 2. Symlink @angular/* packages back to fpcare's copies (prevents TS-993004 dual-identity errors)
CLIB=/path/to/moh-common-lib-angular/node_modules
FPNM=$(pwd)/node_modules
for pkg in animations common compiler compiler-cli core forms platform-browser platform-browser-dynamic router; do
  rm -rf $CLIB/@angular/$pkg
  ln -s $FPNM/@angular/$pkg $CLIB/@angular/$pkg
done

# 3. Symlink ngx-mask back to fpcare's copy
rm -rf $CLIB/ngx-mask
ln -s $FPNM/ngx-mask $CLIB/ngx-mask
```

Replace `/path/to/moh-common-lib-angular` with the actual path to the common lib source repo on your machine.

---

## Running the Dev Server

```bash
npm start
# or
ng serve
```

The app is served at **http://localhost:4302/fpcare/**

The dev server proxies API calls to the dev OpenShift environment via `src/proxy.conf.json`. To point at a different backend, update that file.

---

## Building

**Development build:**
```bash
ng build
# or
npm run dev-build
```

**Production build:**
```bash
ng build --configuration=production
```

> The `prebuild` hook automatically runs `node src/version.js` to stamp the current version into the bundle before every build.

Output is written to `dist/`.

---

## Testing

Tests run with **Jest** (not Karma). Do not use `ng test`.

**Run all tests:**
```bash
npx jest --config jest.config.ts
```

**Run a single spec file:**
```bash
npx jest --config jest.config.ts src/app/path/to/component.spec.ts
```

**Run in watch mode (re-runs on file changes):**
```bash
npx jest --config jest.config.ts --watch
```

**Run with coverage report:**
```bash
npx jest --config jest.config.ts --coverage
```

Coverage is collected from `src/app/**/*.ts`, excluding spec files and modules. Output is written to `coverage/`.

### Known exclusions and skips

The following files are excluded from the test run (see `jest.config.ts`):

| File | Reason |
|---|---|
| `src/test.ts` | Legacy Karma entry point — not a spec file |
| `src/app/models/api.model.spec.ts` | All tests commented out (pending restoration) |
| `src/app/validation/fpcare-required.directive.spec.ts` | All tests commented out (pending restoration) |
| `src/app/validation/base-validation.component.spec.ts` | Helper/export file only — no tests |

Five tests are currently marked `xit` (skipped) in the eligibility and registration-status components — they require DOM-event-based form validation rather than direct model mutation and are pending a fix.

---

## Linting

```bash
npm run lint
# or
npx eslint src --ext .ts,.html
```

---

## Maintenance Mode / Splash Page

The splash page is controlled via OpenShift environment variables on the `spa-env-server` pod.

**To enable maintenance mode:**

1. Go to the target OpenShift environment (dev / test / prod)
2. Navigate to: Applications → Deployments → `spa-env-server` → Environment tab
3. Set the following variables:

| Variable | Description |
|---|---|
| `SPA_ENV_FPC_MAINTENANCE_START` | Start time for maintenance window |
| `SPA_ENV_FPC_MAINTENANCE_END` | End time for maintenance window |
| `SPA_ENV_FPC_MAINTENANCE_MESSAGE` | Optional custom message shown below the default splash |

`spa-env-server` automatically activates maintenance mode between the start and end times. `SPA_ENV_FPC_MAINTENANCE_FLAG` does not need to be set — leave it `false`.

---

## Versioning and Deployments

Before deploying to TEST or PROD, bump the version using one of:

```bash
npm run test-version   # increments minor: 0.1.0 → 0.2.0
npm run prod-version   # increments major: 1.0.0 → 2.0.0
```

These commands automatically increment the version in `package.json`, commit the change, and create a git tag. Run them with a **clean working directory** (no uncommitted changes).

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

## Security

### Dependency vulnerabilities resolved

| Package / Area | Action | Result |
|---|---|---|
| `@angular/*` | Upgraded 19.2.10 → 19.2.20 | Closed 50 vulnerabilities (0 remaining in production) |
| `tar` | Added npm override `^7.0.0` | Closed HIGH-severity vulnerability |
| `serialize-javascript` | Added npm override `^7.0.0` | Closed HIGH-severity vulnerability |
| `ngx-bootstrap ^5.5.0` | Removed (was dead code — directives commented out, no active usage) | Eliminated vulnerable package |
| `karma` and all karma plugins | Removed — replaced with Jest | Eliminated vulnerable test tooling chain |

**Current state:** `npm audit` reports 0 production vulnerabilities. 6 low-severity dev-only vulnerabilities remain via `@angular-builders/jest` → `@tootallnate/once`; these are blocked by the Angular 19 version lock and will clear on an Angular 20 upgrade.

### HTTP / XSRF audit

All HTTP service classes were audited for URL injection and XSRF exposure:

| File | Result |
|---|---|
| `api-service.service.ts` | CLEAN — URLs are hardcoded constants from `environment.ts` |

---

## Application Details

### Tech Stack

- **Angular 19** (`~19.2.20`)
- **Bootstrap 4** with custom BC Government theme
- **ngx-mask 19** — input masking
- **ngx-bootstrap 19** — modal/tooltip components
- **moh-common-lib-angular** — shared BC MoH component library (linked locally)

### Pages

Most pages use the page framework layout. Available layouts: `single`, `double`, `default`.
Content in an `<aside>` renders in the right column for multi-column layouts.

```html
<common-page-framework layout="single">
  <common-form-action-bar
    [canContinue]="canContinue()"
    (click)="continue()"
  ></common-form-action-bar>
</common-page-framework>
```

### Dates

Use `SimpleDate` for all dates in code to avoid conversion issues between `Date` and `SimpleDate`. The date component uses `SimpleDate` internally.

### Validation

Use the `fpcareRequired` directive for field validation. It accepts a comma-delimited list of validators; defaults to `required` if none provided.

Available validators: `required`, `phn-check`, `sin-check`

```html
<div class="form-group">
  <label for="phn">PHN</label>
  <input
    class="form-control"
    id="phn"
    fpcareRequired="required,phn-check"
  />
</div>
```

### API Proxy (local dev)

`src/proxy.conf.json` proxies `/fpcare/api/` to the dev OpenShift backend. Update the `target` URL if you need to point at a different environment.
