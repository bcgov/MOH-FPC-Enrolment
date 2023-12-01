import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('Home Page', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display "Get Started"', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Get Started');
  });

  it('should display "Information Collection Notice" on dialog box', () => {
    page.navigateTo();
    expect(page.getModalTitle()).toEqual('Information Collection Notice');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });
});
