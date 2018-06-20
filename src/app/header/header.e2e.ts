import { browser, by, element } from 'protractor';
import 'tslib';

describe('Header', () => {
  beforeAll(async () => {
    await browser.get('/');
  });

  it('should have logo', () => {
    let subject = element(by.css('.logo-placeholder')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  afterAll(async () => {
      await browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return /managementCenter\/nodes$/.test(url);
      });
    }, 10000);
  });

});
