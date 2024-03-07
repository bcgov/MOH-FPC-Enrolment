const testUrl =
  "https://itrf-web-3f9283-dev.apps.silver.devops.gov.bc.ca/itrf/";

describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://itrf-web-3f9283-dev.apps.silver.devops.gov.bc.ca/itrf/");
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testUrl);
      expect(loc.pathname).to.eq("/itrf/");
    });
    cy.get("[data-cy=captchaInput]").type("irobot");
    cy.get("[data-cy=consentCheckbox]").click();
    cy.get("[data-cy=consentContinue]").click();
    cy.get("[data-cy=hasFiledIncomeTaxReturn]");
    cy.get("[data-cy=continueBar]").click();
  });
});
