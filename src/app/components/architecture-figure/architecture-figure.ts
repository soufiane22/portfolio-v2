import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { CaseStudy } from '../../content/case-studies';
import type { Lang } from '../../i18n';

@Component({
  selector: 'app-architecture-figure',
  template: `
    <figure
      class="m-0 flex flex-col gap-5 rounded-2xl border border-line bg-bg-2 bg-[linear-gradient(var(--line-2)_1px,transparent_1px),linear-gradient(90deg,var(--line-2)_1px,transparent_1px)] bg-size-[28px_28px] p-[clamp(1.25rem,3vw,2rem)]"
    >
      <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        @for (col of architecture().columns; track col.step) {
          <div class="flex flex-col gap-2.5">
            <span class="font-mono text-[11px] text-mute">{{ col.step }} · {{ col.label[lang()] }}{{ col.arrow ? ' →' : '' }}</span>
            @for (node of col.nodes; track node.name.en) {
              <div
                class="flex flex-col gap-2.5 rounded-[10px] bg-bg p-3.5"
                [class]="node.owned ? 'border border-accent' : 'border border-line'"
              >
                <span class="font-semibold">{{ node.name[lang()] }}</span>
                @if (node.detail; as detail) {
                  <span class="font-mono text-[11px] text-mute">{{ detail[lang()] }}</span>
                }
                @if (node.tags; as tags) {
                  <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0 font-mono text-[11px]">
                    @for (tag of tags; track tag) {
                      <li class="rounded-[5px] bg-accent-soft px-[7px] py-[3px] text-accent">{{ tag }}</li>
                    }
                  </ul>
                }
                @if (node.libs; as libs) {
                  <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0 font-mono text-[11px] text-fg-2">
                    @for (lib of libs; track lib) {
                      <li class="rounded-[5px] border border-line px-[7px] py-[3px]">{{ lib }}</li>
                    }
                  </ul>
                }
                @if (node.caption; as caption) {
                  <span class="font-mono text-[11px] text-mute">{{ caption[lang()] }}</span>
                }
              </div>
            }
          </div>
        }
      </div>
      <div class="flex flex-wrap justify-between gap-2 rounded-[10px] border border-dashed border-line px-3.5 py-3 font-mono text-xs text-fg-2">
        <span>{{ architecture().pipeline.left[lang()] }}</span>
        <span class="text-mute">{{ architecture().pipeline.right[lang()] }}</span>
      </div>
      <figcaption class="font-mono text-xs text-mute">{{ architecture().caption[lang()] }}</figcaption>
    </figure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchitectureFigure {
  readonly architecture = input.required<CaseStudy['architecture']>();
  readonly lang = input.required<Lang>();
}
