import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Dictionary, Lang } from '../../i18n';
import { LangSwitch } from '../lang-switch/lang-switch';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

// TODO: add 'notes' back between 'skills' and 'contact' once the notes section is restored.
const NAV_KEYS = ['about', 'experience', 'work', 'skills', 'contact'] as const;
type NavKey = (typeof NAV_KEYS)[number];

/** A section becomes current once its top passes this line, just under the sticky header. */
const ACTIVE_LINE_PX = 140;

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, LangSwitch, ThemeToggle],
  templateUrl: './site-header.html',
  host: { '(keydown.escape)': 'menuOpen.set(false)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  readonly lang = input.required<Lang>();
  readonly dict = input.required<Dictionary>();
  protected readonly menuOpen = signal(false);
  protected readonly navKeys = NAV_KEYS;
  /** Section currently in view; its nav item stays highlighted (scroll spy). */
  protected readonly active = signal<NavKey | null>(null);

  private readonly doc = inject(DOCUMENT);
  /** While a click-triggered smooth scroll runs, keep the clicked item instead of the sections it passes. */
  private locked = false;
  private unlockTimer = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Browser only. A scroll listener (not an IntersectionObserver) because several sections
    // live in @defer blocks that appear after this header has rendered.
    afterNextRender(() => {
      const win = this.doc.defaultView;
      if (!win) return;
      let frame = 0;
      const update = (): void => {
        frame = 0;
        if (!this.locked) this.active.set(this.currentSection(win));
      };
      const schedule = (): void => {
        if (!frame) frame = win.requestAnimationFrame(update);
      };
      const unlock = (): void => {
        if (!this.locked) return;
        this.locked = false;
        win.clearTimeout(this.unlockTimer);
        update();
      };
      win.addEventListener('scroll', schedule, { passive: true });
      win.addEventListener('resize', schedule, { passive: true });
      win.addEventListener('scrollend', unlock, { passive: true });
      this.unlock = unlock;
      update();
      destroyRef.onDestroy(() => {
        win.cancelAnimationFrame(frame);
        win.clearTimeout(this.unlockTimer);
        win.removeEventListener('scroll', schedule);
        win.removeEventListener('resize', schedule);
        win.removeEventListener('scrollend', unlock);
      });
    });
  }

  /** Clicking an item highlights it right away, before the scroll reaches the section. */
  protected select(key: NavKey): void {
    this.active.set(key);
    this.menuOpen.set(false);
    const win = this.doc.defaultView;
    if (!win) return;
    this.locked = true;
    // Released by 'scrollend'; the timeout covers browsers without it and clicks that do not scroll.
    win.clearTimeout(this.unlockTimer);
    this.unlockTimer = win.setTimeout(() => this.unlock(), 1500);
  }

  /** Set once the listeners are attached in the browser. */
  private unlock: () => void = () => (this.locked = false);

  private currentSection(win: Window): NavKey | null {
    const present = NAV_KEYS.filter((key) => this.doc.getElementById(key));
    if (!present.length) return null;
    // At the very bottom the last section may never reach the line, so it wins there.
    if (win.innerHeight + win.scrollY >= this.doc.documentElement.scrollHeight - 2) {
      return present[present.length - 1];
    }
    let current: NavKey | null = null;
    for (const key of present) {
      const top = this.doc.getElementById(key)?.getBoundingClientRect().top ?? Infinity;
      if (top <= ACTIVE_LINE_PX) current = key;
    }
    return current;
  }
}
