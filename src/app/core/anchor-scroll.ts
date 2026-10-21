import { DOCUMENT } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const GIVE_UP_MS = 4000;
const USER_INPUT_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

/**
 * Finishes a scroll whose target is not on the page yet because it lives in (or below) a
 * `@defer` block that renders after the route has activated. We watch the DOM and keep
 * aligning while the deferred sections fill in, then stop. Stops as soon as the visitor
 * scrolls or interacts, so it never fights the user.
 */
@Injectable({ providedIn: 'root' })
export class AnchorScroll {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private stop: (() => void) | null = null;

  /** Scroll to the element with this id, waiting for it to render if needed. */
  scrollWhenReady(id: string): void {
    this.stop?.();
    if (!this.isBrowser || this.doc.getElementById(id)) return; // existing targets are scrolled by the caller
    this.watch(() => {
      this.doc.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      return false; // keep aligning while content above it is still rendering
    });
  }

  /** Restore a saved scroll position, waiting until the page is tall enough to reach it. */
  restorePosition(x: number, y: number): void {
    this.stop?.();
    const win = this.doc.defaultView;
    if (!this.isBrowser || !win) return;
    const reached = (): boolean => {
      win.scrollTo({ left: x, top: y, behavior: 'instant' });
      return Math.abs(win.scrollY - y) <= 1;
    };
    if (!reached()) this.watch(reached);
  }

  /** Re-runs `align` on every DOM change until it returns true, the visitor interacts, or we give up. */
  private watch(align: () => boolean): void {
    const win = this.doc.defaultView;
    if (!win) return;
    const observer = new MutationObserver(() => {
      if (align()) this.stop?.();
    });
    const timer = win.setTimeout(() => this.stop?.(), GIVE_UP_MS);
    const onUserInput = (): void => this.stop?.();

    this.stop = () => {
      observer.disconnect();
      win.clearTimeout(timer);
      USER_INPUT_EVENTS.forEach((e) => win.removeEventListener(e, onUserInput));
      this.stop = null;
    };
    USER_INPUT_EVENTS.forEach((e) => win.addEventListener(e, onUserInput, { passive: true }));
    observer.observe(this.doc.body, { childList: true, subtree: true });
  }
}
