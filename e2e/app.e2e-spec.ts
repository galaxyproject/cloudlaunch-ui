import { CloudlaunchUiPage } from './app.po';

describe('cloudlaunch-ui App', function() {
  let page: CloudlaunchUiPage;

  beforeEach(() => {
    page = new CloudlaunchUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toContain('Appliance Catalog');
  });
});
