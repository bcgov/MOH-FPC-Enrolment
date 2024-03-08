const testUrl = "http://localhost:5173/itrf/"; //change out if needed

//Dev environment
const testFirstName = "KDAF";
const testLastName = "WCL";
const testBirthDateDay = "23";
const testBirthDateMonth = 11; //integer. January = 1, December = 12, etc
const testBirthDateYear = "1985";
const testphn = "9502976289";

describe("happy path", () => {
  it("passes", () => {
    cy.visit(testUrl);
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testUrl);
      expect(loc.pathname).to.eq("/itrf/");
    });
    //Get started page
    cy.get("[data-cy=captchaInput]").type("irobot");
    cy.get("[data-cy=consentCheckbox]").click();
    cy.get("[data-cy=consentContinue]").click();
    cy.get("[data-cy=filed-income-tax-returnfiled-income-tax-return-y]").click({
      force: true,
    });
    cy.get("[data-cy=spousespouse-n]").click({ force: true });
    cy.get("[data-cy=continue-bar]").click();
    //Personal info page
    cy.get("[data-cy=firstName]").type(testFirstName);
    cy.get("[data-cy=lastName]").type(testLastName);
    cy.get("select")
      .find(`option[data-cy=birthdateMonth${testBirthDateMonth - 1}]`)
      .then(($el) => $el.get(0).setAttribute("selected", "selected"))
      .parent()
      .trigger("change");
    cy.get("[data-cy=birthdateDay]").type(testBirthDateDay);
    cy.get("[data-cy=birthdateYear]").type(testBirthDateYear);
    cy.get("[data-cy=phn]").type(testphn);
    cy.get("[data-cy=continueBar]").click();
  });
});
