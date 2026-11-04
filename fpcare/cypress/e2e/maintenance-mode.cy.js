// Maintenance mode (splash page) is driven by the spa-env-server response from
// POST /fpcare/api/env. Every test stubs that endpoint and waits on it, so a
// build that never sends the request fails here instead of passing by default.

const START = "2030-01-01 01:00:00 AM";
const END = "2030-01-02 01:00:00 AM";
const MESSAGE = "this is a test maintenance message foobar";

function envResponse(flag) {
  return {
    SPA_ENV_FPC_MAINTENANCE_FLAG: flag,
    SPA_ENV_FPC_MAINTENANCE_START: START,
    SPA_ENV_FPC_MAINTENANCE_END: END,
    SPA_ENV_FPC_MAINTENANCE_MESSAGE: MESSAGE,
    SPA_ENV_FPC_ENABLE_ADDRESS_VALIDATOR: "false",
  };
}

// The env endpoint is stubbed with the given flag. The other calls the app
// makes on load (loadMessages and logging) are proxied to the DEV OpenShift
// route by src/proxy.conf.json, so they are stubbed to keep the run off DEV.
// A non-success loadMessages payload would also redirect the app to the
// registration results page.
function stubBackend(flag) {
  cy.intercept("POST", "/fpcare/api/env", {
    statusCode: 200,
    body: envResponse(flag),
  }).as("env");
  cy.intercept("GET", "/fpcare/api/fpcareIntegration/rest/loadMessages", {
    statusCode: 200,
    body: { regStatusCode: "0", regStatusMsg: "", uuid: "", messages: [] },
  });
  cy.intercept("POST", "/fpcare/api/logging", {
    statusCode: 200,
    body: { returnCode: "success" },
  });
}

describe("maintenance mode", () => {
  let consoleErrors;

  beforeEach(() => {
    consoleErrors = [];
    cy.on("window:before:load", (win) => {
      cy.stub(win.console, "error").callsFake((...args) => {
        consoleErrors.push(args.join(" "));
      });
    });
  });

  afterEach(() => {
    expect(consoleErrors, "browser console.error calls").to.have.length(0);
  });

  context("flag is true", () => {
    beforeEach(() => {
      stubBackend("true");
      cy.visit("/");
      cy.wait("@env");
    });

    it("redirects to the maintenance page and shows start, end and message", () => {
      cy.location("pathname").should("eq", "/fpcare/maintenance");
      cy.get("h1").should("have.text", "Maintenance Mode");
      cy.contains("p", "Maintenance window start:").find("strong").should("have.text", START);
      cy.contains("p", "Maintenance window end:").find("strong").should("have.text", END);
      cy.contains("h2", "Maintenance message").next().should("contain.text", MESSAGE);
    });

    // The splash page has no links, so the router's CanDeactivate guard is
    // driven the way the browser back/forward buttons drive it: push a URL
    // onto the history and fire popstate, which the Angular router handles as
    // a navigation to that URL.
    it("blocks in-app navigation away from the maintenance page", () => {
      cy.location("pathname").should("eq", "/fpcare/maintenance");
      cy.window().then((win) => {
        win.history.pushState({}, "", "/fpcare/registration-status");
        win.dispatchEvent(new win.PopStateEvent("popstate", { state: {} }));
      });
      // The guard rejects the navigation; the router restores the URL.
      cy.location("pathname").should("eq", "/fpcare/maintenance");
      cy.get("h1").should("have.text", "Maintenance Mode");
    });
  });

  context("flag is false", () => {
    beforeEach(() => {
      stubBackend("false");
    });

    it("stays on the home page", () => {
      cy.visit("/");
      cy.wait("@env");
      cy.get("h1").should("have.text", "Home Page");
      cy.location("pathname").should("eq", "/fpcare/");
    });

    it("redirects a direct visit to the maintenance page back to home", () => {
      cy.visit("/maintenance");
      cy.wait("@env");
      cy.location("pathname").should("eq", "/fpcare/");
      cy.get("h1").should("have.text", "Home Page");
    });
  });
});
