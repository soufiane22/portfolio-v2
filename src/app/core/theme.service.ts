import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'dark' | 'light';
const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly _theme = signal<Theme>(this.read());
  readonly theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      // setAttribute, not dataset: the server-side DOM has no dataset support.
      this.doc.documentElement.setAttribute('data-theme', this._theme());
    });
  }

  toggle(): void {
    const next: Theme = this._theme() === 'dark' ? 'light' : 'dark';
    this._theme.set(next);
    try {
      this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (private mode); the theme still applies for this visit.
    }
  }

  private read(): Theme {
    try {
      const stored = this.doc.defaultView?.localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // ignore: fall back to the default
    }
    return 'dark';
  }
}
