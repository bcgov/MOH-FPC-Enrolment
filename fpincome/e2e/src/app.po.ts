import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('fpir-root #content h1')).getText() as Promise<
      string
    >;
  }

  getModalTitle() {
    return element(
      by.css('fpir-root #content fpir-collection-notice h2')
    ).getText() as Promise<string>;
  }
}
