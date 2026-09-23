import { glow, rng, type Scene, type SceneLabel } from "./engine";

/**
 * Halq or taqsir, and the Umrah is complete: points of light gather into an
 * eight-point star, the motif of the whole site, turning slowly around the
 * words "may Allah accept it" (set in HTML by the component).
 */

type Pt = { k: number; kin: number; ph: number; size: number; c: number };

const PALETTE = ["rgba(255,240,204,0.95)", "rgba(233,203,134,0.92)", "rgba(212,171,90,0.85)", "rgba(255,251,242,0.9)"];

export class HalqScene implements Scene {
  id = "halq" as const;
  fade = 0.18;
  private pts: Pt[] = [];
  private t = 0;

  layout(w: number): SceneLabel[] {
    if (!this.pts.length) {
      const r = rng(41);
      const n = w > 520 ? 1500 : 800;
      this.pts = Array.from({ length: n }, () => {
        const roll = r();
        return {
          k: r(),
          // Most trace the outline; the rest fill the star but keep its centre clear for the words.
          kin: r() < 0.7 ? 1 : 0.5 + r() * 0.45,
          ph: r() * Math.PI * 2,
          size: 0.9 + r() * 1.3,
          c: roll < 0.5 ? 0 : roll < 0.78 ? 1 : roll < 0.93 ? 2 : 3,
        };
      });
    }
    return [];
  }

  step(dt: number, t: number) {
    this.t = t;
    void dt;
  }

  drawStatic(bg: CanvasRenderingContext2D, _mid: CanvasRenderingContext2D, W: number, H: number) {
    const S = Math.min(W, H);
    const cx = W / 2;
    const cy = H / 2;
    const g = bg.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
    g.addColorStop(0, "#0c1f19");
    g.addColorStop(1, "#030a08");
    bg.fillStyle = g;
    bg.fillRect(0, 0, W, H);
    glow(bg, cx, cy, S * 0.45, "rgba(212,171,90,0.14)");
    bg.strokeStyle = "rgba(212,171,90,0.4)";
    bg.lineWidth = 1;
    bg.beginPath();
    bg.arc(cx, cy, S * 0.44, 0, Math.PI * 2);
    bg.stroke();
    bg.strokeStyle = "rgba(212,171,90,0.2)";
    bg.setLineDash([2, 6]);
    bg.beginPath();
    bg.arc(cx, cy, S * 0.465, 0, Math.PI * 2);
    bg.stroke();
    bg.setLineDash([]);
    // Words sit on a dark disc in the middle
    const d = bg.createRadialGradient(cx, cy, 0, cx, cy, S * 0.17);
    d.addColorStop(0, "rgba(3,11,9,0.9)");
    d.addColorStop(1, "rgba(3,11,9,0)");
    bg.fillStyle = d;
    bg.fillRect(0, 0, W, H);
  }

  drawDynamic(_back: CanvasRenderingContext2D, front: CanvasRenderingContext2D, W: number, H: number) {
    const S = Math.min(W, H);
    const R = S * 0.37;
    const r0 = S * 0.165;
    const rot = this.t * 0.07 - Math.PI / 2;
    const cx = W / 2;
    const cy = H / 2;
    let current = -1;
    for (const p of this.pts) {
      if (p.c !== current) {
        current = p.c;
        front.fillStyle = PALETTE[current];
      }
      const e = p.k * 16;
      const i = Math.floor(e);
      const f = e - i;
      const rad = (j: number) => (j % 2 === 0 ? R : r0);
      const a0 = (i / 16) * Math.PI * 2 + rot;
      const a1 = ((i + 1) / 16) * Math.PI * 2 + rot;
      const breathe = p.kin * (1 + Math.sin(this.t * 1.3 + p.ph) * 0.015);
      const x = (rad(i) * Math.cos(a0) * (1 - f) + rad(i + 1) * Math.cos(a1) * f) * breathe;
      const y = (rad(i) * Math.sin(a0) * (1 - f) + rad(i + 1) * Math.sin(a1) * f) * breathe;
      front.fillRect(cx + x - p.size / 2, cy + y - p.size / 2, p.size, p.size);
    }
  }
}
