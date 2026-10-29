import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Mobile hero background: a dotted grid tilted in perspective that scrolls towards the viewer,
 * over a slowly breathing accent glow. Pure CSS, no JavaScript: only `transform` and `opacity`
 * are animated, so the compositor runs it without repainting.
 */
@Component({
  selector: 'app-perspective-grid',
  template: '<div class="glow"></div><div class="grid"><div class="plane"></div></div>',
  styleUrl: './perspective-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class PerspectiveGrid {}
