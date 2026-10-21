import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';

const YOUTUBE_ID = /^[\w-]{11}$/;

/**
 * Lightweight YouTube embed: a designed cover (title + big play button over a dimmed poster)
 * and the heavy player only after the visitor clicks play, from youtube-nocookie.com.
 */
@Component({
  selector: 'app-video-embed',
  imports: [NgOptimizedImage],
  template: `
    <div class="relative aspect-video overflow-hidden rounded-2xl border border-line bg-black shadow-[0_30px_80px_rgb(0_0_0/0.45)]">
      @if (playing() && src(); as url) {
        <iframe
          class="absolute inset-0 size-full"
          [src]="url"
          [title]="title()"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      } @else {
        <button
          type="button"
          (click)="playing.set(true)"
          [attr.aria-label]="playLabel() + ' — ' + title()"
          class="group absolute inset-0 size-full cursor-pointer border-0 bg-transparent p-0 text-left text-white"
        >
          <!-- The poster is low-resolution, so it is dimmed and used as a backdrop rather than the focus. -->
          <img
            [ngSrc]="poster()"
            fill
            alt=""
            class="scale-105 object-cover opacity-55 blur-[1.5px] transition-[opacity,filter] duration-300 group-hover:opacity-70 group-hover:blur-0"
          />
          <span class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.15),rgb(0_0_0/0.7))]"></span>
          <span class="absolute inset-0 flex flex-col items-center justify-center gap-[clamp(0.75rem,2.5vw,1.5rem)] px-6 text-center">
            <span
              aria-hidden="true"
              class="grid size-[clamp(3.5rem,8vw,5.5rem)] place-items-center rounded-full bg-accent text-accent-ink shadow-[0_0_0_10px_rgb(255_255_255/0.08),0_14px_40px_rgb(0_0_0/0.5)] transition-transform group-hover:scale-110"
            >
              <svg viewBox="0 0 24 24" class="ml-1 size-[45%]" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" /></svg>
            </span>
            <span class="hidden max-w-[28ch] text-[clamp(1.25rem,2.6vw,2rem)] leading-tight font-semibold tracking-[-0.02em] text-balance sm:block">
              {{ title() }}
            </span>
          </span>
          <span class="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[11px] backdrop-blur-sm sm:bottom-4 sm:left-4">
            ▶ YouTube
          </span>
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoEmbed {
  readonly youtubeId = input.required<string>();
  readonly title = input.required<string>();
  readonly poster = input.required<string>();
  readonly playLabel = input.required<string>();
  protected readonly playing = signal(false);
  private readonly sanitizer = inject(DomSanitizer);

  /** Only a validated id is ever interpolated into the trusted URL. */
  protected readonly src = computed<SafeResourceUrl | null>(() => {
    const id = this.youtubeId();
    if (!YOUTUBE_ID.test(id)) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
    );
  });
}
