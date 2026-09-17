// Ported from the deleted protractor spec e2e/src/app.e2e-spec.ts.
// Same describe block name, same two assertions, same afterEach
// zero-severe-console-error check (protractor read browser logs for
// logging.Level.SEVERE; Cypress has no equivalent API, so console.error
// calls are spied on window:before:load and asserted empty per test).

describe('Home Page', () => {
  let consoleErrors;

  beforeEach(() => {
    consoleErrors = [];
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake((...args) => {
        consoleErrors.push(args.join(' '));
      });
    });
    cy.visit('/');
  });

  afterEach(() => {
    expect(consoleErrors, 'browser console.error calls').to.have.length(0);
  });

  it('should display "Get Started"', () => {
    cy.get('fpir-root #content h1').invoke('text').should('eq', 'Get Started');
  });

  it('should display "Information Collection Notice" on dialog box', () => {
    cy.get('fpir-root #content fpir-collection-notice h2')
      .invoke('text')
      .should('eq', 'Information Collection Notice');
  });
});
