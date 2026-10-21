import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { profile } from '../../content/profile';
import { LANGS, type Dictionary, type Lang } from '../../i18n';
import { TerrainCanvas } from '../terrain-canvas/terrain-canvas';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, TerrainCanvas],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  readonly lang = input.required<Lang>();
  readonly dict = input.required<Dictionary>();
  protected readonly profile = profile;
  protected readonly langs = LANGS;
}
