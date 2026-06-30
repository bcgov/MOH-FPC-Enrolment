import envData from "../fixtures/env-data.js";

const d = new Date();
//dates are formatted to match the time format in the spa-env-service
const startDate = `${d.getFullYear() - 1}-${d.getMonth().toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} 01:00:00 AM`;
const endDate = `${d.getFullYear() + 1}-${d.getMonth().toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} 01:00:00 AM`;
const testMessage = "this is a test maintenance message foobar";

describe("maintenance mode", () => {
  it("redirects to the maintenance page when it receives correct input", () => {
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
    }
    console.log("intercepted spa-env-server call with 200 OK response");
    cy.intercept("POST", "/itrf/api/env", {
      statusCode: 200,
      body: {
        SPA_ENV_ITRF_MAINTENANCE_FLAG: "true",
        SPA_ENV_ITRF_MAINTENANCE_START: startDate,
        SPA_ENV_ITRF_MAINTENANCE_END: endDate,
        SPA_ENV_ITRF_MAINTENANCE_MESSAGE: testMessage,
        SPA_ENV_ITRF_TIME_FORMAT: "YYYY-MM-DD h:mm:ss A",
        testfield: "This is a stubbed test response from Cypress",
      },
    });
    cy.visit("/");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/itrf/maintenance");
    });
    cy.get("[data-cy=maintenance-message]").contains(testMessage);
  });
});