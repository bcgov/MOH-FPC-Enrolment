// Ported from the deleted protractor spec e2e/home-page/home-page.e2e-spec.ts.
// Same describe block name, same single assertion. The protractor spec had
// no afterEach at all; the zero-console-error check below is new coverage
// added by this port, not carried over (console.error calls are spied on
// window:before:load and asserted empty per test).

describe("HomePage", () => {
  let consoleErrors;

  beforeEach(() => {
    consoleErrors = [];
    cy.on("window:before:load", (win) => {
      cy.stub(win.console, "error").callsFake((...args) => {
        consoleErrors.push(args.join(" "));
      });
    });
    cy.visit("/");
  });

  afterEach(() => {
    expect(consoleErrors, "browser console.error calls").to.have.length(0);
  });

  it("should display home page", () => {
    cy.get("h1").invoke("text").should("eq", "Home Page");
  });
});
