import { browser, by, element } from 'protractor';
import 'tslib';

describe('Home', () => {

  beforeEach(async () => {
    /**
     * Change hash depending on router LocationStrategy.
     */
    await browser.get('/');
  });

  it('should have a title', async () => {
    let subject = await browser.getTitle();
    let result  = 'RackHD Web UI 2.0';
    expect(subject).toEqual(result);
  });
});
