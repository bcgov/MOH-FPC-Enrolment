import envData from "../fixtures/env-data.js";

//Dev environment
const testPhnFormatted =
  envData.testPhn.substring(0, 4) +
  " " +
  envData.testPhn.substring(4, 7) +
  " " +
  envData.testPhn.substring(7, 10);

describe("happy path", () => {
  it("passes", () => {
    if (envData.enableIntercepts) {
      console.log("intercepted captcha calls with 200 OK response");
      cy.intercept("POST", "/itrf/api/captcha/captcha", {
        statusCode: 200,
        body: {
          nonce: "1234567890",
          captcha: "captcha",
          testfield: "This is a stubbed test response from Cypress",
        },
      });

      cy.intercept("POST", "/itrf/api/captcha/verify/captcha", {
        statusCode: 200,
        body: {
          valid: true,
          jwt: "1234567890",
          testfield: "This is a stubbed test response from Cypress",
        },
      });

      console.log("intercepted logging calls with 200 OK response");
      cy.intercept("POST", "/itrf/api/logging", {
        statusCode: 200,
        body: {
          returnCode: "success",
          testfield: "This is a stubbed test response from Cypress",
        },
      });

      console.log("intercepted env calls with 200 OK response");
      cy.intercept("POST", "/itrf/api/env", {
        statusCode: 200,
        body: {
          returnCode: "success",
          testfield: "This is a stubbed test response from Cypress",
        },
      });

      console.log("intercept validate POST with 200 OK response");
      cy.intercept("POST", "/itrf/api/itrfIntegration/validatePerson/**", {
        statusCode: 200,
        body: {
          returnCode: "success",
          testfield: "This is a stubbed response from a Cypress Intercept",
        },
      });

      console.log("intercept submit POST with 200 OK response");
      cy.intercept("POST", "/itrf/api/itrfIntegration/submitForm/**", {
        statusCode: 200,
        body: {
          returnCode: "success",
          testfield: "This is a stubbed response from a Cypress Intercept",
        },
      });
    }

    cy.visit("/");
    cy.location().should((loc) => {
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
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/itrf/personal-info");
    });
    cy.get("[data-cy=firstName]").type(envData.testFirstName);
    cy.get("[data-cy=lastName]").type(envData.testLastName);
    cy.get("select")
      .find(`option[data-cy=birthdateMonth${envData.testBirthDateMonth - 1}]`)
      .then(($el) => $el.get(0).setAttribute("selected", "selected"))
      .parent()
      .trigger("change");
    cy.get("[data-cy=birthdateDay]").type(envData.testBirthDateDay);
    cy.get("[data-cy=birthdateYear]").type(envData.testBirthDateYear);
    cy.get("[data-cy=phn]").type(envData.testPhn);
    cy.get("[data-cy=continueBar]").click();
    //Submission page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/itrf/submission");
    });
    cy.get("[data-cy=ReviewTableElement]").contains(envData.testFirstName);
    cy.get("[data-cy=ReviewTableElement]").contains(envData.testLastName);
    cy.get("[data-cy=ReviewTableElement]").contains(envData.testBirthDateDay);
    //skipping month because it needs to be converted to a month name
    cy.get("[data-cy=ReviewTableElement]").contains(envData.testBirthDateYear);
    cy.get("[data-cy=ReviewTableElement]").contains(testPhnFormatted);
  });
});
