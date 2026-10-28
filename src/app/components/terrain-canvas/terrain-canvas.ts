  import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { ThemeService, type Theme } from '../../core/theme.service';

interface Node3 {
  readonly x: number;
  readonly z: number;
}

interface Projected {
  x: number;
  y: number;
  d: number;
  s: number;
}

interface Pulse {
  edge: number;
  u: number;
  v: number;
  reverse: boolean;
}

interface Palette {
  readonly base: string;
  readonly accent: string;
  readonly edgeAlpha: number;
}

const PALETTES: Record<Theme, Palette> = {
  dark: { base: '225,220,210', accent: '245,185,74', edgeAlpha: 0.3 },
  light: { base: '40,30,18', accent: '196,124,26', edgeAlpha: 0.32 },
};
const COLS = 26;
const ROWS = 12;
const STATIC_TIME = 4;

/** Deterministic PRNG so the terrain looks identical on every load. */
function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildTerrain(): { nodes: Node3[]; edges: [number, number][] } {
  const r = rng(3);
  const nodes: Node3[] = [];
  const edges: [number, number][] = [];
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      nodes.push({
        x: -1.7 + (3.4 * i) / (COLS - 1) + (r() - 0.5) * 0.07,
        // The first row sits slightly in front of the camera (z < 0) so it projects below
        // the canvas and the mesh reaches the bottom edge of the hero.
        z: (j - 1) / (ROWS - 2) + (r() - 0.5) * 0.03,
      });
    }
  }
  const id = (i: number, j: number): number => j * COLS + i;
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      if (i < COLS - 1) edges.push([id(i, j), id(i + 1, j)]);
      if (j < ROWS - 1) edges.push([id(i, j), id(i, j + 1)]);
      if (i < COLS - 1 && j < ROWS - 1) {
        edges.push((i + j) % 2 ? [id(i, j), id(i + 1, j + 1)] : [id(i + 1, j), id(i, j + 1)]);
      }
    }
  }
  return { nodes, edges };
}

/** Decorative wireframe terrain. Animates only when motion is allowed and the screen is large. */
@Component({
  selector: 'app-terrain-canvas',
  template: '<canvas #canvas aria-hidden="true" class="block size-full"></canvas>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerrainCanvas {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly theme = inject(ThemeService);
  /** Set once the canvas is running; lets a theme change repaint a static frame. */
  private repaint: (() => void) | null = null;

  constructor() {
    afterNextRender(() => this.start());
    effect(() => {
      this.theme.theme();
      this.repaint?.();
    });
  }

  private start(): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { nodes, edges } = buildTerrain();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const small = window.matchMedia('(max-width: 767px)');
    const animated = (): boolean => !reduced.matches && !small.matches;
    const hero = this.host.closest('section') ?? this.host;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;
    let px = -999;
    let py = -999;
    let pulses: Pulse[] = [];
    let raf = 0;
    let visible = true;

    const project = (p: Node3, t: number): Projected => {
      const y = 0.08 * Math.sin(p.x * 2.2 + t * 0.45 + p.z * 3) + 0.05 * Math.cos(p.z * 6 - t * 0.35);
      const pz = 1 / (0.6 + p.z * 2);
      return {
        x: w * 0.5 + (p.x - mx * 0.15) * w * 0.45 * pz,
        y: h * 0.12 + (0.4 - y + my * 0.04) * h * 1.15 * pz,
        d: 1 - p.z,
        s: pz * 0.8,
      };
    };

    const draw = (t: number, anim: boolean): void => {
      const { base, accent, edgeAlpha } = PALETTES[this.theme.theme()];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const P = nodes.map((n) => project(n, t));
      const near = P.map((p) => (anim ? Math.max(0, 1 - Math.hypot(p.x - px, p.y - py) / 140) : 0));

      ctx.lineWidth = 1;
      edges.forEach(([i, j]) => {
        const a = P[i];
        const b = P[j];
        const alpha = edgeAlpha * (0.12 + (0.88 * (a.d + b.d)) / 2);
        const hot = Math.max(near[i], near[j]);
        ctx.strokeStyle = hot > 0.02 ? `rgba(${accent},${Math.max(alpha, hot * 0.8)})` : `rgba(${base},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      if (anim) {
        if (pulses.length < 14 && Math.random() < 0.08) {
          pulses.push({
            edge: Math.floor(Math.random() * edges.length),
            u: 0,
            v: 0.006 + Math.random() * 0.01,
            reverse: Math.random() < 0.5,
          });
        }
      } else if (!pulses.length) {
        for (let i = 0; i < 9; i++) {
          pulses.push({ edge: (i * 53 + 17) % edges.length, u: 0.6, v: 0, reverse: i % 2 === 1 });
        }
      }
      pulses = pulses.filter((p) => p.u <= 1);

      ctx.save();
      ctx.shadowColor = `rgba(${accent},0.9)`;
      ctx.shadowBlur = 10;
      ctx.fillStyle = `rgb(${accent})`;
      for (const p of pulses) {
        const [i, j] = edges[p.edge];
        const a = P[p.reverse ? j : i];
        const b = P[p.reverse ? i : j];
        const x = a.x + (b.x - a.x) * p.u;
        const y = a.y + (b.y - a.y) * p.u;
        const u0 = Math.max(0, p.u - 0.3);
        ctx.strokeStyle = `rgba(${accent},0.7)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(a.x + (b.x - a.x) * u0, a.y + (b.y - a.y) * u0);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 2 * Math.max(0.7, (a.s + b.s) / 2), 0, Math.PI * 2);
        ctx.fill();
        if (anim) p.u += p.v;
      }
      ctx.restore();

      P.forEach((p, i) => {
        const a = 0.2 + 0.8 * p.d;
        ctx.fillStyle = near[i] > 0.1 ? `rgba(${accent},${Math.max(a, near[i])})` : `rgba(${base},${a * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.7 * p.s + near[i] * 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const paintStatic = (): void => {
      mx = my = 0;
      pulses = [];
      draw(STATIC_TIME, false);
    };

    const loop = (ts: number): void => {
      raf = 0;
      if (!visible || !animated()) return;
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
      draw(ts / 1000, true);
      raf = requestAnimationFrame(loop);
    };

    const kick = (): void => {
      if (animated()) {
        if (!raf && visible) raf = requestAnimationFrame(loop);
      } else {
        paintStatic();
      }
    };

    const size = (): void => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (!animated()) paintStatic();
    };

    const onMove = (e: PointerEvent): void => {
      const r = canvas.getBoundingClientRect();
      const hr = hero.getBoundingClientRect();
      tmx = ((e.clientX - hr.left) / hr.width) * 2 - 1;
      tmy = ((e.clientY - hr.top) / hr.height) * 2 - 1;
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    const onLeave = (): void => {
      tmx = tmy = 0;
      px = py = -999;
    };

    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });
    io.observe(canvas);
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    reduced.addEventListener('change', kick);
    small.addEventListener('change', kick);

    this.repaint = () => {
      if (!animated() && w) paintStatic();
    };
    size();
    kick();

    this.destroyRef.onDestroy(() => {
      this.repaint = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      reduced.removeEventListener('change', kick);
      small.removeEventListener('change', kick);
    });
  }
}
