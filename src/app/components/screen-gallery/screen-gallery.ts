import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type { MediaImage } from '../../content/case-studies';
import type { Lang } from '../../i18n';

export interface GalleryLabels {
  readonly prev: string;
  readonly next: string;
  readonly goTo: string;
  readonly enlarge: string;
  readonly close: string;
  readonly unavailable: string;
}

/**
 * Screenshot strip in tablet frames: one screen on phones (with the next one peeking),
 * two on tablets, three on desktop. Swipe / scroll-snap, previous & next buttons, dots,
 * a caption under each screen, and a full-size view in a native <dialog>.
 */
@Component({
  selector: 'app-screen-gallery',
  imports: [NgOptimizedImage],
  templateUrl: './screen-gallery.html',
  host: {
    '(keydown.arrowleft)': 'go(index() - 1)',
    '(keydown.arrowright)': 'go(index() + 1)',
    '(window:resize)': 'onScroll()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenGallery {
  readonly items = input.required<readonly MediaImage[]>();
  readonly lang = input.required<Lang>();
  readonly label = input.required<string>();
  readonly labels = input.required<GalleryLabels>();

  /** Index of the first fully visible screen. */
  protected readonly index = signal(0);
  /** How many screens fit side by side (1 on phones, up to 3 on desktop). */
  protected readonly visible = signal(1);
  protected readonly atStart = signal(true);
  protected readonly atEnd = signal(false);
  protected readonly zoomed = signal<MediaImage | null>(null);
  /** The full-size image failed to load (e.g. the server is unreachable). */
  protected readonly zoomFailed = signal(false);
  /** True while the visitor drags the strip with the mouse. */
  protected readonly dragging = signal(false);

  /** Mouse drag in progress: where it started and whether it moved far enough to count as a drag. */
  private drag: { readonly x: number; readonly left: number; moved: boolean } | null = null;
  /** Swallows the click that ends a drag, so dropping on a screen does not open it. */
  private suppressClick = false;

  /** "3 / 7" on phones, "3–5 / 7" when several screens are visible. */
  protected readonly position = computed(() => {
    const first = this.index() + 1;
    const last = Math.min(this.index() + this.visible(), this.items().length);
    return `${last > first ? `${first}–${last}` : first} / ${this.items().length}`;
  });

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    afterNextRender(() => this.onScroll());
  }

  protected isVisible(i: number): boolean {
    return i >= this.index() && i < this.index() + this.visible();
  }

  /** Distance between the starts of two consecutive slides (slide width + gap). */
  private step(el: HTMLElement): number {
    const slides = el.children;
    if (slides.length < 2) return el.clientWidth;
    return (slides[1] as HTMLElement).offsetLeft - (slides[0] as HTMLElement).offsetLeft;
  }

  protected onScroll(): void {
    const el = this.track().nativeElement;
    const step = this.step(el);
    if (!step) return;
    // n slides fit when n × slide + (n − 1) × gap ≤ width, i.e. n ≈ (width + gap) / step.
    const gap = step - (el.children[0] as HTMLElement).offsetWidth;
    this.visible.set(Math.max(1, Math.round((el.clientWidth + gap) / step)));
    this.index.set(Math.max(0, Math.min(Math.round(el.scrollLeft / step), this.items().length - 1)));
    this.atStart.set(el.scrollLeft <= 2);
    this.atEnd.set(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }

  protected go(i: number): void {
    const el = this.track().nativeElement;
    const target = Math.max(0, Math.min(i, this.items().length - 1));
    this.index.set(target);
    el.scrollTo({ left: target * this.step(el) });
  }

  // Mouse drag-to-scroll. Touch screens already swipe natively, so only mice are handled here.
  protected onPointerDown(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    this.drag = { x: event.clientX, left: this.track().nativeElement.scrollLeft, moved: false };
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.drag) return;
    const el = this.track().nativeElement;
    const dx = event.clientX - this.drag.x;
    if (!this.drag.moved) {
      if (Math.abs(dx) < 6) return; // a small jitter is still a click
      this.drag.moved = true;
      this.dragging.set(true); // turns off scroll-snap so the strip follows the cursor
      el.setPointerCapture(event.pointerId);
    }
    el.scrollLeft = this.drag.left - dx;
  }

  protected onPointerUp(): void {
    if (!this.drag) return;
    const moved = this.drag.moved;
    this.drag = null;
    if (!moved) return;
    this.dragging.set(false);
    this.suppressClick = true;
    setTimeout(() => (this.suppressClick = false));
    const el = this.track().nativeElement;
    this.go(Math.round(el.scrollLeft / this.step(el))); // settle on the nearest screen
  }

  protected open(item: MediaImage): void {
    if (this.suppressClick) return;
    this.zoomFailed.set(false);
    this.zoomed.set(item);
    this.dialog().nativeElement.showModal();
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  /** Clicking the dark backdrop (outside the image) closes the dialog. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
