/**
 * A tiny layered canvas stage for the "Umrah in four steps" scenes.
 *
 * Four stacked canvases: `bg` (static: sky, architecture, floor), `back`
 * (moving figures behind the main structure, with long-exposure trails), `mid`
 * (static: the Kaaba and anything that must hide what is behind it) and
 * `front` (moving figures in front, the walker, trails). Static layers are
 * drawn once per resize or scene change; only `back` and `front` redraw per
 * frame. The loop pauses off-screen, in background tabs and for reduced motion.
 */

export type RiteId = "ihram" | "tawaf" | "sai" | "halq";

export type WalkState = { kind: "tawaf" | "sai"; count: number; hint: string; done: boolean };

/**
 * An HTML label over the stage. With `px`/`py` it sits away from the thing it
 * names and a fine leader line joins the two.
 */
export type SceneLabel = {
  id: string;
  text: string;
  x: number;
  y: number;
  anchor?: "left" | "right" | "center" | "above" | "below";
  tone?: "gold" | "green";
  px?: number;
  py?: number;
};

export type Hints = {
  blackStone: string;
  rabbana: string;
  freely: string;
  tawafDone: string;
  safaStart: string;
  greenLights: string;
  saiDone: string;
};

export interface Scene {
  id: RiteId;
  /** Trail strength: the share of last frame erased each frame (lower = longer trails). */
  fade: number;
  layout(w: number, h: number): SceneLabel[];
  drawStatic(bg: CanvasRenderingContext2D, mid: CanvasRenderingContext2D, w: number, h: number): void;
  step(dt: number, t: number): void;
  drawDynamic(back: CanvasRenderingContext2D, front: CanvasRenderingContext2D, w: number, h: number): void;
  startWalk?(): void;
  walk?(): WalkState | null;
  flag?(): boolean;
}

// ─── Small maths helpers ─────────────────────────────────────────────────────

export type V3 = [number, number, number];

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

export type Camera = { pos: V3; fwd: V3; right: V3; up: V3; f: number; cx: number; cy: number };

/**
 * A pinhole camera orbiting `target`: `az` is the compass direction from the
 * target to the camera in the x-east / z-south ground plane, `pitch` the angle
 * above the horizon, `fov` the horizontal field of view.
 */
export function makeCamera(o: { w: number; h: number; az: number; pitch: number; dist: number; target: V3; fov: number; cx?: number; cy?: number }): Camera {
  const ch = Math.cos(o.pitch) * o.dist;
  const pos: V3 = [o.target[0] + Math.cos(o.az) * ch, o.target[1] + Math.sin(o.pitch) * o.dist, o.target[2] + Math.sin(o.az) * ch];
  const fwd = norm(sub(o.target, pos));
  const right = norm(cross(fwd, [0, 1, 0]));
  const up = cross(right, fwd);
  return { pos, fwd, right, up, f: o.w / 2 / Math.tan(o.fov / 2), cx: o.cx ?? o.w / 2, cy: o.cy ?? o.h / 2 };
}

export type P2 = { x: number; y: number; d: number; k: number };

/** World (x east, y up, z south) to screen. `k` is pixels per metre at that depth. */
export function project(c: Camera, x: number, y: number, z: number): P2 {
  const rx = x - c.pos[0];
  const ry = y - c.pos[1];
  const rz = z - c.pos[2];
  const d = rx * c.fwd[0] + ry * c.fwd[1] + rz * c.fwd[2];
  const k = c.f / Math.max(0.01, d);
  return {
    x: c.cx + (rx * c.right[0] + ry * c.right[1] + rz * c.right[2]) * k,
    y: c.cy - (rx * c.up[0] + ry * c.up[1] + rz * c.up[2]) * k,
    d,
    k,
  };
}

/** Deterministic pseudo-random numbers, so static art is identical on every redraw. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function poly(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[]) {
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
}

export function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha = 1) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;
}

// ─── The stage ───────────────────────────────────────────────────────────────

type Layers = { bg: HTMLCanvasElement; back: HTMLCanvasElement; mid: HTMLCanvasElement; front: HTMLCanvasElement };

export class Stage {
  private ctx: Record<keyof Layers, CanvasRenderingContext2D>;
  private scene: Scene | null = null;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private raf = 0;
  private last = 0;
  private t = 0;
  private running = false;
  private visible = false;
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private lastWalk = "";
  private lastFlag = false;

  constructor(
    private layers: Layers,
    private wrap: HTMLElement,
    private opts: {
      reduced: boolean;
      onLabels: (l: SceneLabel[]) => void;
      onWalk: (w: WalkState | null) => void;
      onFlag: (on: boolean) => void;
    },
  ) {
    this.ctx = {
      bg: layers.bg.getContext("2d")!,
      back: layers.back.getContext("2d")!,
      mid: layers.mid.getContext("2d")!,
      front: layers.front.getContext("2d")!,
    };
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(wrap);
    this.io = new IntersectionObserver(
      (entries) => {
        // Entries can arrive batched (hidden, then visible again); only the latest counts.
        this.visible = entries[entries.length - 1].isIntersecting;
        if (this.visible) this.start();
        else this.stop();
      },
      { rootMargin: "120px" },
    );
    this.io.observe(wrap);
    document.addEventListener("visibilitychange", this.onVis);
  }

  destroy() {
    this.stop();
    this.ro.disconnect();
    this.io.disconnect();
    document.removeEventListener("visibilitychange", this.onVis);
  }

  private onVis = () => {
    if (document.hidden) this.stop();
    else if (this.visible) this.start();
  };

  /** Swap scenes with a short crossfade of the whole stage. */
  setScene(scene: Scene, immediate = false) {
    const apply = () => {
      this.scene = scene;
      this.lastWalk = "";
      this.opts.onWalk(null);
      this.lastFlag = false;
      this.opts.onFlag(false);
      this.redraw();
      this.wrap.style.opacity = "1";
    };
    if (immediate || !this.scene || this.opts.reduced) return apply();
    this.wrap.style.opacity = "0";
    window.setTimeout(apply, 380);
  }

  startWalk() {
    this.scene?.startWalk?.();
    if (this.opts.reduced) this.pollState();
  }

  private resize() {
    const w = Math.round(this.wrap.clientWidth);
    const h = Math.round(this.wrap.clientHeight);
    if (!w || !h || (w === this.w && h === this.h)) return;
    this.w = w;
    this.h = h;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    for (const key of Object.keys(this.layers) as (keyof Layers)[]) {
      const c = this.layers[key];
      c.width = Math.round(w * this.dpr);
      c.height = Math.round(h * this.dpr);
      this.ctx[key].setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    this.redraw();
  }

  private redraw() {
    const s = this.scene;
    if (!s || !this.w) return;
    const { bg, back, mid, front } = this.ctx;
    for (const c of [bg, back, mid, front]) c.clearRect(0, 0, this.w, this.h);
    this.opts.onLabels(s.layout(this.w, this.h));
    s.drawStatic(bg, mid, this.w, this.h);
    // One settled frame, so the scene is complete even before (or without) animation.
    s.step(0, this.t);
    s.drawDynamic(back, front, this.w, this.h);
  }

  private start() {
    if (this.opts.reduced || this.running) return;
    this.running = true;
    this.last = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 1 / 60;
    this.last = now;
    this.t += dt;
    const s = this.scene;
    if (s && this.w) {
      s.step(dt, this.t);
      const { back, front } = this.ctx;
      for (const c of [back, front]) {
        c.globalCompositeOperation = "destination-out";
        c.fillStyle = `rgba(0,0,0,${s.fade})`;
        c.fillRect(0, 0, this.w, this.h);
        c.globalCompositeOperation = "source-over";
      }
      s.drawDynamic(back, front, this.w, this.h);
      this.pollState();
    }
    this.raf = requestAnimationFrame(this.frame);
  };

  private pollState() {
    const s = this.scene;
    if (!s) return;
    const w = s.walk?.() ?? null;
    const key = w ? `${w.kind}|${w.count}|${w.hint}|${w.done}` : "";
    if (key !== this.lastWalk) {
      this.lastWalk = key;
      this.opts.onWalk(w);
    }
    const f = s.flag?.() ?? false;
    if (f !== this.lastFlag) {
      this.lastFlag = f;
      this.opts.onFlag(f);
    }
  }
}
