import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Fades an element in the first time it scrolls into view.
 * Runs only in the browser, skips elements already on screen and honours prefers-reduced-motion,
 * so prerendered HTML and no-JS visitors always see the content.
 */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!('IntersectionObserver' in window)) return;
      if (this.el.getBoundingClientRect().top < window.innerHeight) return;

      this.el.classList.add('reveal', 'reveal-pending');
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          this.el.classList.remove('reveal-pending');
          io.disconnect();
        },
        { rootMargin: '0px 0px -8% 0px' },
      );
      io.observe(this.el);
    });
  }
}
