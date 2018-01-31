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

  describe('when logged', () => {

    it('should show user icon and user name', async () => {
      let result  = true;
      let subject = await element(by.css('clr-icon[shape=user]')).isPresent();
      expect(subject).toEqual(result);
      subject = await element(by.css('a.user-name')).isPresent();
      expect(subject).toEqual(result);
    });

    it('should show logout button and icon', async () => {
      let result  = true;
      let subject = await element(by.css('a.logout')).isPresent();
      expect(subject).toEqual(result);
      subject = await element(by.css('clr-icon[shape=logout]')).isPresent();
      expect(subject).toEqual(result);
    });

  });

  describe('when logged out', () => {
    beforeAll(async () => {
      element(by.css('a.logout')).click();
      // wait browser navigating
      await browser.wait(function() {
        return browser.getCurrentUrl().then(function(url) {
          return /login/.test(url);
        });
      }, 10000);
    })

    it('should navigate to login page', async () => {
      await browser.get('/');
      await browser.getCurrentUrl().then(url => {
        let subject = /login/.test(url);
        let result = true;
        expect(subject).toEqual(result);
      });
    });

    it('should hide user icon and user name', async () => {
      let result  = false;
      let subject = await element(by.css('clr-icon[shape=user]')).isPresent();
      expect(subject).toEqual(result);
      subject = await element(by.css('authService.loginUser')).isPresent();
      expect(subject).toEqual(result);
    });

    it('should hide logout button and icon', async () => {
      let result  = false;
      let subject = await element(by.css('a.logout')).isPresent();
      expect(subject).toEqual(result);
      subject = await element(by.css('clr-icon[shape=logout]')).isPresent();
      expect(subject).toEqual(result);
    });

  });

  afterAll(async () => {
    await element(by.id('login_username')).sendKeys('rackhd');
    await element(by.id('login_password')).sendKeys('rackhd');
    await element(by.css('button[type=submit]')).click();

    await browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return /home/.test(url);
      });
    }, 10000);
  });

});
