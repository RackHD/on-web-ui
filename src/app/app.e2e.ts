import { browser, by, element } from 'protractor';
import 'tslib';

describe('App', () => {

  beforeEach(async () => {
    await browser.get('/');
  });

  it('should navigate to home page after login', async () => {
    await browser.getCurrentUrl().then(url => {
      let subject = /home/.test(url);
      let result = true;
      expect(subject).toEqual(result);
    });
  });

});
