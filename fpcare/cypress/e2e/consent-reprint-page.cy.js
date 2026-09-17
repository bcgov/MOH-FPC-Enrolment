// Ported from the deleted protractor spec
// e2e/consent-reprint-page/consent-reprint-page.e2e-spec.ts (plus
// e2e/base-page.po.ts and e2e/consent-modal.po.ts, not carried over
// wholesale - only the selectors these two tests need).
//
// Three changes from the protractor original, all decided 2026-09-15:
// - The real captcha cannot be solved in a test, so the captcha API is
//   stubbed with cy.intercept (fetch + verify endpoints, read from
//   src/proxy.conf.json and the CaptchaDataService usage in
//   ConsentModalComponent: apiBaseUrl is '/fpcare/api/captcha').
// - The protractor page object's unconditional
//   `XLSX.readFile('/home2/kristin.reed/Downloads/Book1.xlsx')` is dropped
//   entirely: it read a hard-coded path on a former developer's laptop, the
//   result (`this.worksheet`) was never used by either assertion, and
//   `xlsx` has been removed from package.json.
// - The protractor spec had no afterEach at all; the zero-console-error
//   check below is new coverage added by this port, not carried over.
//
// The old protractor selector `captcha .bcgov-captcha` is stale - the real
// element is `common-captcha` (moh-common-lib-angular). Verified against
// the rendered DOM: `common-captcha input#answer` is the answer field, and
// it only exists once the consent checkbox is checked (`*ngIf="agreeCheck"`
// in consent-modal.component.html).

describe("FPCARE Request Consent Tests", () => {
  let consoleErrors;

  const modal = "fpcare-consent-modal > .modal";
  const checkbox = "fpcare-consent-modal .d-flex .checkbox .d-inline .btn";
  const submitButton =
    'fpcare-consent-modal .modal-footer button[type="submit"]';
  const captchaAnswer = "common-captcha input#answer";

  beforeEach(() => {
    consoleErrors = [];
    cy.on("window:before:load", (win) => {
      cy.stub(win.console, "error").callsFake((...args) => {
        consoleErrors.push(args.join(" "));
      });
    });

    cy.intercept("POST", "**/fpcare/api/captcha/captcha", {
      statusCode: 200,
      body: { captcha: "<svg></svg>", validation: "stub-validation" },
    }).as("fetchCaptcha");

    cy.intercept("POST", "**/fpcare/api/captcha/verify/captcha", {
      statusCode: 200,
      body: { valid: true, jwt: "stub-jwt-token" },
    }).as("verifyCaptcha");

    cy.visit("/reprint-letters/consent");
  });

  afterEach(() => {
    expect(consoleErrors, "browser console.error calls").to.have.length(0);
  });

  it("should display consent modal", () => {
    cy.get(modal).should("be.visible");
    cy.get(submitButton).should("be.disabled");
  });

  it("should close consent modal upon agreement", () => {
    cy.get(checkbox).click();
    cy.wait("@fetchCaptcha");
    cy.get(captchaAnswer).type("abc123");
    cy.wait("@verifyCaptcha");
    cy.get(submitButton).should("be.enabled").click();
    cy.get(modal).should("not.be.visible");
  });
});
