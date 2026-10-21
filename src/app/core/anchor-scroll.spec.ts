import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AnchorScroll } from './anchor-scroll';

describe('AnchorScroll', () => {
  let scrollIntoView: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView as unknown as typeof Element.prototype.scrollIntoView;
  });

  afterEach(() => document.body.replaceChildren());

  it('scrolls to a target that is rendered after the call (deferred section)', async () => {
    const service = TestBed.inject(AnchorScroll);
    service.scrollWhenReady('late');
    expect(scrollIntoView).not.toHaveBeenCalled();

    const section = document.createElement('section');
    section.id = 'late';
    document.body.append(section);
    await Promise.resolve(); // let the MutationObserver callback run
    await new Promise((resolve) => setTimeout(resolve));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
  });

  it('leaves existing targets to the router', () => {
    const section = document.createElement('section');
    section.id = 'here';
    document.body.append(section);
    TestBed.inject(AnchorScroll).scrollWhenReady('here');
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('keeps restoring a back/forward position until the page is tall enough', async () => {
    let maxScroll = 500; // the page is still short: deferred sections have not rendered yet
    let current = 0;
    vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => current);
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(((opts: ScrollToOptions) => {
      current = Math.min(opts.top ?? 0, maxScroll);
    }) as typeof window.scrollTo);

    TestBed.inject(AnchorScroll).restorePosition(0, 2600);
    expect(current).toBe(500);

    maxScroll = 5000; // deferred content arrives
    document.body.append(document.createElement('section'));
    await new Promise((resolve) => setTimeout(resolve));

    expect(current).toBe(2600);
    scrollTo.mockRestore();
  });

  it('stops aligning once the visitor scrolls', async () => {
    TestBed.inject(AnchorScroll).scrollWhenReady('gone');
    window.dispatchEvent(new Event('wheel'));

    const section = document.createElement('section');
    section.id = 'gone';
    document.body.append(section);
    await new Promise((resolve) => setTimeout(resolve));

    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
