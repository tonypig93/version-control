import { VersionControlPage } from './app.po';

describe('version-control App', function() {
  let page: VersionControlPage;

  beforeEach(() => {
    page = new VersionControlPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
