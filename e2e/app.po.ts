import { browser, element, by } from 'protractor';

export class CloudlaunchUiPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('clui-root h1')).getText();
  }
}
