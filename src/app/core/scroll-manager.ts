import { DOCUMENT, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, Scroll } from '@angular/router';
import { filter } from 'rxjs';
import { AnchorScroll } from './anchor-scroll';

/** Distance from the top of the viewport where we pick the element to keep in place (below the sticky header). */
const PROBE_Y = 120;

interface KeptPosition {
  readonly node: Element | null;
  readonly top: number;
  readonly y: number;
}

/**
 * Owns scrolling after every navigation (the router's own scrolling is disabled in app.config):
 * - language switch → the same content stays at the same place on screen,
 * - back / forward → the previous position is restored,
 * - `#fragment` → scroll to that section, waiting for it if it is still deferred,
 * - anything else → top of the page.
 */
@Injectable({ providedIn: 'root' })
export class ScrollManager {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly viewport = inject(ViewportScroller);
  private readonly anchorScroll = inject(AnchorScroll);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private kept: KeptPosition | null = null;

  init(): void {
    if (!this.isBrowser) return;
    // We restore positions ourselves on back/forward, so the browser must not do it too.
    this.viewport.setHistoryScrollRestoration('manual');
    this.router.events
      .pipe(
        filter((e): e is Scroll => e instanceof Scroll),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => this.onScroll(e));
  }

  /** Call right before a navigation that should not move the page (e.g. switching language). */
  keepPosition(): void {
    const win = this.doc.defaultView;
    if (!this.isBrowser || !win) return;
    const node = this.doc.elementFromPoint(win.innerWidth / 2, PROBE_Y);
    const anchor = node && node !== this.doc.body && node !== this.doc.documentElement ? node : null;
    this.kept = { node: anchor, top: anchor?.getBoundingClientRect().top ?? 0, y: win.scrollY };
  }

  private onScroll(event: Scroll): void {
    const win = this.doc.defaultView;
    if (!win) return;
    const kept = this.kept;
    this.kept = null;

    if (kept) {
      // Wait for the new language to render, then shift by however much the kept element moved.
      win.requestAnimationFrame(() => {
        if (kept.node?.isConnected) {
          win.scrollBy({ top: kept.node.getBoundingClientRect().top - kept.top, behavior: 'instant' });
        } else {
          win.scrollTo({ top: kept.y, behavior: 'instant' });
        }
      });
      return;
    }
    if (event.position) {
      // Back / forward: the page may still be rendering its deferred sections, so wait for the height.
      const [x, y] = event.position;
      this.anchorScroll.restorePosition(x, y);
      return;
    }
    if (event.anchor) {
      const target = this.doc.getElementById(event.anchor);
      if (target) target.scrollIntoView({ block: 'start' });
      else this.anchorScroll.scrollWhenReady(event.anchor);
      return;
    }
    win.scrollTo({ top: 0, behavior: 'instant' });
  }
}
