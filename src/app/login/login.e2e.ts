import { browser, by, element } from 'protractor';
import 'tslib';

describe('Login', () => {

  beforeAll(async () => {
    element(by.css('a.logout')).click();
    // wait browser navigating
    await browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return /login/.test(url);
      });
    }, 10000);
  });

  it('should have a title', async () => {
    let subject = await browser.getTitle();
    let result  = 'MARS';
    expect(subject).toEqual(result);
  });

  it('should have header', async () => {
    let subject = await element(by.css('header')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  it('should have logo .branding', async () => {
    let subject = await element(by.css('.branding')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  it('should have login form', async () => {
    let subject = await element(by.css('form.login')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  it('should login in when input user/password', async () => {
    await element(by.id('login_username')).sendKeys('rackhd');
    await element(by.id('login_password')).sendKeys('rackhd');
    await element(by.css('button[type=submit]')).click();

    await browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return /home/.test(url);
      });
    }, 10000);

    await browser.getCurrentUrl().then(url => {
      let subject = /home/.test(url);
      let result = true;
      expect(subject).toEqual(result);
    });
  })

});
