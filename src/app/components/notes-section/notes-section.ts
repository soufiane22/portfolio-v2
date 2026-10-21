import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { notes } from '../../content/notes';
import type { Dictionary, Lang } from '../../i18n';
import { Reveal } from '../../shared/reveal.directive';

@Component({
  selector: 'app-notes-section',
  imports: [Reveal],
  template: `
    <section id="notes" class="border-t border-line-2">
      <div class="page-x section-y flex flex-wrap gap-x-12 gap-y-6">
        <p class="m-0 flex-none basis-50 font-mono text-[13px] text-mute">{{ dict().sections.notes }}</p>
        <div class="max-w-215 flex-[1_1_520px]">
          <h2 appReveal class="display-h2 mb-8">{{ dict().headings.notes }}</h2>
          <ul class="m-0 flex list-none flex-col border-t border-line p-0">
            @for (note of notes; track note.id) {
              <li appReveal class="border-b border-line">
                <!-- TODO: link each note once the article is published (content/notes.ts, url field). -->
                @if (note.url; as url) {
                  <a [href]="url" class="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 py-5.5">
                    <span class="flex-[1_1_320px] text-xl font-medium tracking-[-0.015em]">{{ note.title[lang()] }}</span>
                    <span class="font-mono text-xs text-mute">{{ note.tag }} · {{ note.minutes }} {{ dict().notes.minutes }}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                } @else {
                  <div class="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 py-5.5">
                    <span class="flex-[1_1_320px] text-xl font-medium tracking-[-0.015em]">{{ note.title[lang()] }}</span>
                    <span class="font-mono text-xs text-mute">{{ note.tag }} · {{ note.minutes }} {{ dict().notes.minutes }}</span>
                    <span class="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-mute">{{ dict().notes.soon }}</span>
                  </div>
                }
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesSection {
  readonly lang = input.required<Lang>();
  readonly dict = input.required<Dictionary>();
  protected readonly notes = notes;
}
