/**
 * @author: @AngularClass
 */

require('ts-node/register');
var helpers = require('./helpers');

exports.config = {
  /**
   * default host url:port of app
   * this is related with e2e cmd in package.json
   */
  baseUrl: 'http://localhost:3000/',

  /**
   * Use `npm run e2e`
   */
  specs: [
    helpers.root('src/**/**.e2e.ts'),
    helpers.root('src/**/*.e2e.ts')
  ],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ["--headless", "--disable-gpu", "--window-size=1280x800",  "--no-sandbox"]
      // 'args': ['show-fps-counter=true']
    }
  },

  onPrepare: function() {
      browser.ignoreSynchronization = true;

      browser.get('/#/login');
      browser.findElement(by.id('login_username')).sendKeys('katalist');
      browser.findElement(by.id('login_password')).sendKeys('katalist');
      browser.findElement(by.css('button[type=submit]')).click();
      return browser.wait(function() {
        return browser.getCurrentUrl().then(function(url) {
          return /home/.test(url);
        });
      }, 10000);
  },

  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
   * `rootEl`
   */
   useAllAngular2AppRoots: true,

   SELENIUM_PROMISE_MANAGER: false,
};
