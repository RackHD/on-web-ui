import { browser, by, element } from 'protractor';
import 'tslib';

describe('Home', () => {

  beforeEach(async () => {
    /**
     * Change hash depending on router LocationStrategy.
     */
    await browser.get('/#/home');
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

  it('should load home component', async () => {
    let subject = await element(by.css('home')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

});
