import { glow, makeCamera, poly, project, rng, type Camera, type Hints, type P2, type Scene, type SceneLabel, type WalkState } from "./engine";

/**
 * Sa'i, looking down the Mas'a from above the rock of Safa towards Marwah: a
 * polished marble floor that mirrors the lights, arcades of white columns with
 * gilded capitals, a coffered ceiling of domes and chandeliers, and the band
 * of green lights that marks where men walk briskly. Pilgrims keep to the
 * right: towards Marwah on the right, back towards Safa on the left, turning
 * at each hill.
 *
 * World units are metres: x across the gallery, y up, z along it from Safa.
 */

const LEN = 400;
const HALF_W = 12; // the colonnades
const WALL = 15.5; // the outer walls behind them
const BAY = 10;
const CEIL = 13;
const CAP = 8.6; // top of the columns
const COL = 0.65; // half the width of a column
const GREEN = { a: 110, b: 165 };
const EYE = 7.5;
const PITCH = (12 * Math.PI) / 180;
const CAM_Z = -12;

const BODY = ["#fbf8f1", "#ece4d6", "#141414", "#cdbf9f", "#80898a"];
// Men in ihram go bareheaded; women's heads are covered.
const SKIN = ["#8e6a50", "#6b4a35", "#b48a6a", "#5a3d2b"];
const COVER: (string | null)[] = [null, null, "#161616", "#f1ece2", null];

type Fig = { lane: -1 | 1; x: number; z: number; v: number; jog: boolean; c: number; h: number; skin: number; ph: number };

const inGreen = (z: number) => z > GREEN.a && z < GREEN.b;

export class SaiScene implements Scene {
  id = "sai" as const;
  fade = 1; // no trails: figures here are close enough to read as people
  private cam!: Camera;
  private w = 0;
  private figs: Fig[] = [];
  private walker: { traveled: number; done: boolean } | null = null;
  private walkState: WalkState | null = null;
  private t = 0;

  constructor(
    private hints: Hints,
    private density = 1,
  ) {}

  layout(w: number, h: number): SceneLabel[] {
    this.w = w;
    const dist = EYE / Math.sin(PITCH);
    this.cam = makeCamera({ w, h, az: -Math.PI / 2, pitch: PITCH, dist, target: [0, 0, CAM_Z + dist * Math.cos(PITCH)], fov: (62 * Math.PI) / 180, cy: h * 0.5 });
    if (!this.figs.length) this.seed();
    const c = this.cam;
    const u = w / 560;
    const safa = project(c, -4.2, 2.3, -4.6);
    const marwah = project(c, 0, 5.5, LEN);
    const green = project(c, -HALF_W + COL, 5.2, GREEN.a + 12);
    const toM = project(c, -6, 0, 30);
    const toS = project(c, 6, 0, 30);
    return [
      { id: "safa", text: "Safa · start", x: safa.x - 46 * u, y: safa.y - 58 * u, anchor: "above", px: safa.x, py: safa.y },
      { id: "marwah", text: "Marwah · end", x: marwah.x, y: marwah.y, anchor: "above" },
      { id: "green", text: "Green lights", x: green.x - 34 * u, y: green.y - 62 * u, anchor: "above", tone: "green", px: green.x, py: green.y },
      { id: "tom", text: "To Marwah", x: toM.x, y: toM.y, anchor: "center", tone: "gold" },
      { id: "tos", text: "Back to Safa", x: toS.x, y: toS.y, anchor: "center", tone: "gold" },
    ];
  }

  private seed() {
    const r = rng(23);
    const n = Math.round((this.w > 500 ? 2200 : 1100) * this.density);
    this.figs = Array.from({ length: n }, () => {
      const lane: -1 | 1 = r() < 0.5 ? -1 : 1;
      const roll = r();
      return {
        lane,
        x: lane * (1.4 + r() * (HALF_W - 2.4)),
        // Denser near the start, as the crowd is at the hills
        z: 1 + Math.pow(r(), 1.25) * (LEN - 5),
        v: 1.5 + r() * 0.9,
        jog: r() < 0.5,
        c: roll < 0.64 ? 0 : roll < 0.72 ? 1 : roll < 0.9 ? 2 : roll < 0.95 ? 3 : 4,
        h: 1.55 + r() * 0.3,
        skin: Math.floor(r() * SKIN.length),
        ph: r() * Math.PI * 2,
      };
    });
  }

  step(dt: number, t: number) {
    this.t = t;
    for (const f of this.figs) {
      const v = f.v * (inGreen(f.z) && f.jog ? 1.7 : 1);
      if (f.lane === -1) {
        f.z += v * dt;
        if (f.z > LEN - 4) {
          f.lane = 1;
          f.x = -f.x;
        }
      } else {
        f.z -= v * dt;
        if (f.z < 1) {
          f.lane = -1;
          f.x = -f.x;
        }
      }
    }
    const w = this.walker;
    if (w) {
      if (!w.done) {
        w.traveled = Math.min(7, w.traveled + dt / 6.2);
        if (w.traveled >= 7) w.done = true;
      }
      const n = Math.min(6, Math.floor(w.traveled));
      const forward = n % 2 === 0;
      const z = this.walkerZ();
      const count = w.done ? 7 : n + 1;
      const h = this.hints;
      const hint = w.done
        ? h.saiDone
        : w.traveled < 0.1
          ? h.safaStart
          : inGreen(z)
            ? h.greenLights
            : `Length ${count}: ${forward ? "Safa to Marwah" : "Marwah to Safa"}.`;
      this.walkState = { kind: "sai", count, hint, done: w.done };
    }
  }

  private walkerZ() {
    const w = this.walker!;
    const n = Math.min(6, Math.floor(w.traveled));
    const f = w.done ? 1 : w.traveled - Math.floor(w.traveled);
    return n % 2 === 0 ? 2 + (LEN - 8) * f : LEN - 6 - (LEN - 8) * f;
  }

  startWalk() {
    this.walker = { traveled: 0, done: false };
    this.step(0, this.t);
  }

  walk() {
    return this.walker ? this.walkState : null;
  }

  // ─── Static art ────────────────────────────────────────────────────────────

  drawStatic(bg: CanvasRenderingContext2D, mid: CanvasRenderingContext2D, W: number, Hh: number) {
    const c = this.cam;
    bg.fillStyle = "#2b2419";
    bg.fillRect(0, 0, W, Hh);
    this.drawCeiling(bg, c);
    this.drawWalls(bg, c);
    this.drawFloor(bg, c);
    // Bays from far to near: arcade, columns and a chandelier in every other bay
    for (let z = LEN - (LEN % BAY); z >= 0; z -= BAY) {
      if (z + BAY <= LEN) for (const side of [-1, 1]) this.drawArch(bg, c, side, z);
      if (z % 20 === 0 && z + BAY <= LEN) this.drawChandelier(bg, c, z + BAY / 2);
      for (const side of [-1, 1]) this.drawColumn(bg, c, side, z);
    }
    this.drawMarwah(bg, c);
    // The green lights, seen far down the hall, wash the arcade in green
    for (const y of [CEIL - 1.5, 4.5]) {
      const gz = project(c, 0, y, (GREEN.a + GREEN.b) / 2);
      bg.save();
      bg.translate(gz.x, gz.y);
      bg.scale(1.8, 1);
      glow(bg, 0, 0, Math.max(40, 14 * gz.k), "rgba(70,235,145,0.3)");
      bg.restore();
    }
    // Warm haze down the length of the hall
    const vp = project(c, 0, EYE, LEN);
    glow(bg, vp.x, vp.y, W * 0.5, "rgba(255,236,200,0.28)");
    this.drawSafa(mid, c);
    void Hh;
  }

  /** Cream coffers between transverse beams, a dome over the centre of each bay. */
  private drawCeiling(bg: CanvasRenderingContext2D, c: Camera) {
    const P = (x: number, z: number, y = CEIL) => project(c, x, y, z);
    const z0 = CAM_Z + 6;
    const ceil = [P(-WALL, z0), P(WALL, z0), P(WALL, LEN), P(-WALL, LEN)];
    const g = bg.createLinearGradient(0, ceil[0].y, 0, ceil[2].y);
    g.addColorStop(0, "#cbbd9f");
    g.addColorStop(0.75, "#eadcbe");
    g.addColorStop(1, "#fff0d4");
    bg.fillStyle = g;
    poly(bg, ceil);
    bg.fill();
    const lanes: [number, number][] = [
      [-WALL + 0.4, -HALF_W - 0.4],
      [-HALF_W + 0.4, -4.4],
      [-3.6, 3.6],
      [4.4, HALF_W - 0.4],
      [HALF_W + 0.4, WALL - 0.4],
    ];
    for (let z = Math.max(0, Math.floor(z0 / BAY) * BAY); z < LEN; z += BAY) {
      const green = inGreen(z + BAY / 2);
      lanes.forEach(([x0, x1], li) => {
        const q = [P(x0, z + 0.7), P(x1, z + 0.7), P(x1, z + BAY - 0.7), P(x0, z + BAY - 0.7)];
        // Recess: a darker rim, then a lit panel
        bg.fillStyle = "rgba(120,100,70,0.22)";
        poly(bg, q);
        bg.fill();
        const inset = 0.5;
        const q2 = [P(x0 + inset, z + 0.7 + inset), P(x1 - inset, z + 0.7 + inset), P(x1 - inset, z + BAY - 0.7 - inset), P(x0 + inset, z + BAY - 0.7 - inset)];
        bg.fillStyle = green ? "rgba(150,240,190,0.55)" : li === 2 ? "rgba(255,246,228,0.75)" : "rgba(255,244,222,0.55)";
        poly(bg, q2);
        bg.fill();
        if (li === 2) {
          // Shallow dome with its lamp
          const ring: P2[] = [];
          for (let i = 0; i <= 24; i++) {
            const a = (i / 24) * Math.PI * 2;
            ring.push(P(Math.cos(a) * 2.9, z + BAY / 2 + Math.sin(a) * 2.9, CEIL + 0.01));
          }
          const ctr = P(0, z + BAY / 2, CEIL + 1.2);
          const rr = Math.max(4, 3 * ctr.k);
          const dg = bg.createRadialGradient(ctr.x, ctr.y, 0, ctr.x, ctr.y, rr);
          dg.addColorStop(0, green ? "#c9ffe0" : "#fffaf0");
          dg.addColorStop(0.55, green ? "#79d9a4" : "#f1dfb9");
          dg.addColorStop(1, green ? "#3f9a6c" : "#c7ae80");
          bg.fillStyle = dg;
          poly(bg, ring);
          bg.fill();
          bg.strokeStyle = "rgba(212,171,90,0.8)";
          bg.lineWidth = Math.max(0.6, 0.08 * ctr.k);
          bg.stroke();
        }
      });
      // Transverse beam with a gilded soffit
      const beam = [P(-WALL, z - 0.45, CEIL - 0.9), P(WALL, z - 0.45, CEIL - 0.9), P(WALL, z + 0.45, CEIL - 0.9), P(-WALL, z + 0.45, CEIL - 0.9)];
      bg.fillStyle = "#d8c9a8";
      poly(bg, beam);
      bg.fill();
      const e0 = P(-WALL, z - 0.45, CEIL - 0.9);
      const e1 = P(WALL, z - 0.45, CEIL - 0.9);
      bg.strokeStyle = inGreen(z) ? "rgba(80,245,150,0.95)" : "rgba(196,150,70,0.8)";
      bg.lineWidth = Math.max(1, (inGreen(z) ? 0.16 : 0.07) * e0.k);
      bg.beginPath();
      bg.moveTo(e0.x, e0.y);
      bg.lineTo(e1.x, e1.y);
      bg.stroke();
      if (inGreen(z)) glow(bg, (e0.x + e1.x) / 2, e0.y, Math.max(16, 6 * e0.k), "rgba(80,240,150,0.35)");
    }
  }

  /** The outer walls behind the colonnades: lit arched openings onto the galleries beyond. */
  private drawWalls(bg: CanvasRenderingContext2D, c: Camera) {
    const P = (x: number, y: number, z: number) => project(c, x, y, z);
    for (const side of [-1, 1]) {
      const x = side * WALL;
      const wall = [P(x, 0, CAM_Z + 4), P(x, 0, LEN), P(x, CEIL, LEN), P(x, CEIL, CAM_Z + 4)];
      const g = bg.createLinearGradient(wall[0].x, 0, wall[1].x, 0);
      g.addColorStop(0, "#d7cab0");
      g.addColorStop(1, "#f3e6c9");
      bg.fillStyle = g;
      poly(bg, wall);
      bg.fill();
      for (let z = 0; z < LEN; z += BAY) {
        const z0 = z + 1.6;
        const z1 = z + BAY - 1.6;
        const arch: P2[] = [P(x, 0.2, z0)];
        for (let i = 0; i <= 12; i++) {
          const t = i / 12;
          arch.push(P(x, 6.6 + Math.sin(t * Math.PI) * 2.2, z0 + (z1 - z0) * t));
        }
        arch.push(P(x, 0.2, z1));
        const lg = bg.createLinearGradient(0, arch[7].y, 0, arch[0].y);
        const green = inGreen(z + BAY / 2);
        lg.addColorStop(0, green ? "rgba(170,245,200,0.95)" : "rgba(255,238,205,0.95)");
        lg.addColorStop(1, green ? "rgba(70,170,115,0.9)" : "rgba(196,146,84,0.9)");
        bg.fillStyle = lg;
        poly(bg, arch);
        bg.fill();
      }
    }
  }

  /** White marble, polished enough to mirror the arcade and the lamps. */
  private drawFloor(bg: CanvasRenderingContext2D, c: Camera) {
    const P = (x: number, y: number, z: number) => project(c, x, y, z);
    const floor = [P(-WALL, 0, CAM_Z + 1), P(WALL, 0, CAM_Z + 1), P(WALL, 0, LEN), P(-WALL, 0, LEN)];
    const g = bg.createLinearGradient(0, floor[0].y, 0, floor[2].y);
    g.addColorStop(0, "#f4efe4");
    g.addColorStop(0.55, "#e4dccb");
    g.addColorStop(1, "#cfc3a8");
    bg.fillStyle = g;
    poly(bg, floor);
    bg.fill();
    bg.save();
    poly(bg, floor);
    bg.clip();
    // Reflections: the chandeliers and columns mirrored in the marble
    for (let z = LEN - 5; z > CAM_Z; z -= 20) {
      const p = P(0, -(CEIL - 2.6), z);
      const green = inGreen(z);
      const rr = Math.max(5, 2.6 * p.k);
      bg.save();
      bg.translate(p.x, p.y);
      bg.scale(0.5, 1.6);
      glow(bg, 0, 0, rr, green ? "rgba(110,245,165,0.4)" : "rgba(255,236,196,0.32)");
      bg.restore();
    }
    bg.globalAlpha = 0.16;
    for (let z = LEN - (LEN % BAY); z >= 0; z -= BAY) for (const side of [-1, 1]) this.drawColumn(bg, c, side, z, true);
    bg.globalAlpha = 1;
    // Stone bands across and along
    bg.strokeStyle = "rgba(110,96,74,0.16)";
    bg.lineWidth = 1;
    for (let z = 0; z < LEN; z += 5) {
      const a = P(-WALL, 0, z);
      const b = P(WALL, 0, z);
      bg.beginPath();
      bg.moveTo(a.x, a.y);
      bg.lineTo(b.x, b.y);
      bg.stroke();
    }
    for (const x of [-9, -6, -3, 3, 6, 9]) {
      const a = P(x, 0, CAM_Z + 1);
      const b = P(x, 0, LEN);
      bg.beginPath();
      bg.moveTo(a.x, a.y);
      bg.lineTo(b.x, b.y);
      bg.stroke();
    }
    // A wash of green light on the floor between the green markers
    const gz = [P(-WALL, 0, GREEN.a), P(WALL, 0, GREEN.a), P(WALL, 0, GREEN.b), P(-WALL, 0, GREEN.b)];
    bg.fillStyle = "rgba(62,224,124,0.16)";
    poly(bg, gz);
    bg.fill();
    bg.restore();
    // The low barrier between the two directions, with a gilded rail
    const side = [P(-0.3, 0, 0), P(-0.3, 1.0, 0), P(-0.3, 1.0, LEN - 5), P(-0.3, 0, LEN - 5)];
    bg.fillStyle = "#cfc4ae";
    poly(bg, side);
    bg.fill();
    const top = [P(-0.3, 1.0, 0), P(0.3, 1.0, 0), P(0.3, 1.0, LEN - 5), P(-0.3, 1.0, LEN - 5)];
    bg.fillStyle = "#efe7d6";
    poly(bg, top);
    bg.fill();
    const r0 = P(0, 1.05, 0);
    const r1 = P(0, 1.05, LEN - 5);
    bg.strokeStyle = "#d4ab5a";
    bg.lineWidth = Math.max(1, 0.06 * r0.k);
    bg.beginPath();
    bg.moveTo(r0.x, r0.y);
    bg.lineTo(r1.x, r1.y);
    bg.stroke();
  }

  /** The arcade between two columns: an arch with the wall above it, up to the ceiling. */
  private drawArch(bg: CanvasRenderingContext2D, c: Camera, side: number, z: number) {
    const x = side * (HALF_W - COL);
    const P = (y: number, zz: number) => project(c, x, y, zz);
    const z0 = z + COL;
    const z1 = z + BAY - COL;
    const curve: P2[] = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      curve.push(P(CAP + Math.sin(t * Math.PI) * 2.7, z0 + (z1 - z0) * t));
    }
    const green = inGreen(z + BAY / 2);
    const g = bg.createLinearGradient(0, P(CEIL, z0).y, 0, P(CAP, z0).y);
    g.addColorStop(0, "#e2d4b6");
    g.addColorStop(1, "#f6eedc");
    bg.fillStyle = g;
    poly(bg, [...curve, P(CEIL - 0.9, z1), P(CEIL - 0.9, z0)]);
    bg.fill();
    bg.strokeStyle = green ? "rgba(80,240,150,0.9)" : "rgba(200,158,80,0.85)";
    bg.lineWidth = Math.max(1, 0.12 * curve[7].k);
    bg.beginPath();
    curve.forEach((p, i) => (i ? bg.lineTo(p.x, p.y) : bg.moveTo(p.x, p.y)));
    bg.stroke();
  }

  private drawColumn(bg: CanvasRenderingContext2D, c: Camera, side: number, z: number, mirror = false) {
    const m = mirror ? -1 : 1;
    const P = (x: number, y: number, zz: number) => project(c, x, y * m, zz);
    const xi = side * (HALF_W - COL); // the face towards the middle
    const xo = side * (HALF_W + COL);
    const zn = z - COL; // the face towards us
    const zf = z + COL;
    const green = inGreen(z);
    // Inner face
    const inner = [P(xi, 0, zn), P(xi, 0, zf), P(xi, CAP, zf), P(xi, CAP, zn)];
    bg.fillStyle = "#e3d8c2";
    poly(bg, inner);
    bg.fill();
    // Front face, lit
    const front = [P(xi, 0, zn), P(xo, 0, zn), P(xo, CAP, zn), P(xi, CAP, zn)];
    const g = bg.createLinearGradient(0, front[2].y, 0, front[0].y);
    g.addColorStop(0, "#fffaf0");
    g.addColorStop(1, "#e2d6bd");
    bg.fillStyle = g;
    poly(bg, front);
    bg.fill();
    if (mirror) return;
    // Gilded capital and a plinth
    const capF = [P(xi - side * 0.18, CAP - 0.8, zn - 0.18), P(xo + side * 0.18, CAP - 0.8, zn - 0.18), P(xo + side * 0.18, CAP, zn - 0.18), P(xi - side * 0.18, CAP, zn - 0.18)];
    const cg = bg.createLinearGradient(capF[0].x, 0, capF[1].x, 0);
    cg.addColorStop(0, "#b88a3a");
    cg.addColorStop(0.5, "#f3dca4");
    cg.addColorStop(1, "#b88a3a");
    bg.fillStyle = cg;
    poly(bg, capF);
    bg.fill();
    const base = [P(xi - side * 0.12, 0, zn - 0.12), P(xo + side * 0.12, 0, zn - 0.12), P(xo + side * 0.12, 0.6, zn - 0.12), P(xi - side * 0.12, 0.6, zn - 0.12)];
    bg.fillStyle = "#d6cab2";
    poly(bg, base);
    bg.fill();
    if (green) {
      // The green markers: a lit strip down the column
      const s0 = P(xi - side * 0.02, 1.2, z);
      const s1 = P(xi - side * 0.02, CAP - 1.2, z);
      bg.strokeStyle = "rgba(90,245,155,0.95)";
      bg.lineWidth = Math.max(1.4, 0.3 * s0.k);
      bg.beginPath();
      bg.moveTo(s0.x, s0.y);
      bg.lineTo(s1.x, s1.y);
      bg.stroke();
      glow(bg, (s0.x + s1.x) / 2, (s0.y + s1.y) / 2, Math.max(12, 4 * s0.k), "rgba(80,240,150,0.4)");
    }
  }

  /** A gilded ring chandelier hanging from the dome of a bay. */
  private drawChandelier(bg: CanvasRenderingContext2D, c: Camera, z: number) {
    const top = project(c, 0, CEIL, z);
    const p = project(c, 0, CEIL - 2.8, z);
    if (p.d < 3) return;
    const green = inGreen(z);
    const rx = 1.35 * p.k;
    glow(bg, p.x, p.y, rx * 2.6, green ? "rgba(110,245,165,0.45)" : "rgba(255,226,160,0.5)");
    bg.strokeStyle = "rgba(212,171,90,0.8)";
    bg.lineWidth = Math.max(0.6, 0.05 * p.k);
    bg.beginPath();
    bg.moveTo(top.x, top.y);
    bg.lineTo(p.x, p.y - rx * 0.5);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      bg.moveTo(p.x, p.y - rx * 0.5);
      bg.lineTo(p.x + Math.cos(a) * rx, p.y + Math.sin(a) * rx * 0.2);
    }
    bg.stroke();
    for (const [ry, rs] of [
      [0, 1],
      [0.42, 0.58],
    ]) {
      bg.strokeStyle = "#e6c77f";
      bg.lineWidth = Math.max(0.8, 0.1 * p.k);
      bg.beginPath();
      bg.ellipse(p.x, p.y + ry * p.k, rx * rs, rx * rs * 0.2, 0, 0, Math.PI * 2);
      bg.stroke();
      const n = rs === 1 ? 12 : 8;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const lx = p.x + Math.cos(a) * rx * rs;
        const ly = p.y + ry * p.k + Math.sin(a) * rx * rs * 0.2 - Math.max(1, 0.12 * p.k);
        const s = Math.max(1.2, 0.14 * p.k);
        bg.fillStyle = green ? "#d9ffe9" : "#fff6dc";
        bg.fillRect(lx - s / 2, ly - s / 2, s, s);
      }
    }
  }

  /** Marwah at the far end: the lit arch over the hill. */
  private drawMarwah(bg: CanvasRenderingContext2D, c: Camera) {
    const P = (x: number, y: number) => project(c, x, y, LEN);
    const end = [P(-WALL, 0), P(WALL, 0), P(WALL, CEIL), P(-WALL, CEIL)];
    bg.fillStyle = "#efe0c0";
    poly(bg, end);
    bg.fill();
    const m = P(0, 4);
    glow(bg, m.x, m.y, 60, "rgba(255,236,196,0.9)");
    const hill = [P(-7, 0), P(-4, 1.6), P(-1, 2.3), P(2.5, 2), P(6, 1.1), P(8, 0)];
    bg.fillStyle = "rgba(140,118,90,0.8)";
    poly(bg, hill);
    bg.fill();
  }

  /**
   * Safa: the bare rock of the hill, one outcrop of rounded lobes worn smooth
   * by centuries of hands, behind a low glass screen with a gilded rail.
   */
  private drawSafa(ctx: CanvasRenderingContext2D, c: Camera) {
    const r = rng(31);
    const lobes = [
      { x: -5.6, z: -5.2, rx: 3.0, h: 2.4 },
      { x: -7.4, z: -3.4, rx: 2.6, h: 1.7 },
      { x: -3.6, z: -3.8, rx: 2.2, h: 1.7 },
      { x: -2.3, z: -2.2, rx: 1.2, h: 0.8 },
      { x: -4.6, z: -1.8, rx: 1.7, h: 1.0 },
    ]
      .map((l) => ({ ...l, b: project(c, l.x, 0, l.z), ph: r() * 6 }))
      .sort((a, b) => b.b.d - a.b.d);
    for (const l of lobes) {
      const b = l.b;
      const R = l.rx * b.k;
      const Hs = l.h * b.k;
      // Smooth irregular outline: sums of sines rather than per-point noise
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= 28; i++) {
        const a = Math.PI * (i / 28);
        const j = 1 + 0.07 * Math.sin(a * 3 + l.ph) + 0.05 * Math.sin(a * 7 + l.ph * 2);
        pts.push({ x: b.x + Math.cos(a) * R * j, y: b.y - Math.sin(a) ** 0.8 * Hs * j });
      }
      const path = new Path2D();
      pts.forEach((p, i) => (i ? path.lineTo(p.x, p.y) : path.moveTo(p.x, p.y)));
      path.closePath();
      // Lit from the lamps above and ahead
      const g = ctx.createRadialGradient(b.x + R * 0.18, b.y - Hs * 0.85, R * 0.05, b.x, b.y - Hs * 0.3, R * 1.25);
      g.addColorStop(0, "#d6c6aa");
      g.addColorStop(0.45, "#9c8770");
      g.addColorStop(1, "#43382e");
      ctx.fillStyle = g;
      ctx.fill(path);
      ctx.save();
      ctx.clip(path);
      // Strata and cracks, following the curve of the lobe
      ctx.lineWidth = Math.max(0.8, 0.03 * b.k);
      for (let i = 0; i < 5; i++) {
        const t = 0.25 + i * 0.14 + r() * 0.05;
        ctx.strokeStyle = i % 2 ? "rgba(60,48,36,0.32)" : "rgba(235,222,198,0.18)";
        ctx.beginPath();
        ctx.ellipse(b.x + (r() - 0.5) * R * 0.3, b.y, R * (1.05 - t * 0.5), Hs * (1.1 - t), 0, Math.PI * (1.1 + r() * 0.1), Math.PI * (1.7 + r() * 0.2));
        ctx.stroke();
      }
      // Pale facets where the rock is polished
      for (let i = 0; i < 4; i++) {
        const fx = b.x + (r() - 0.5) * R * 1.1;
        const fy = b.y - Hs * (0.35 + r() * 0.5);
        const fs = R * (0.12 + r() * 0.12);
        ctx.fillStyle = "rgba(245,236,218,0.12)";
        ctx.beginPath();
        ctx.ellipse(fx, fy, fs, fs * 0.55, -0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      // Contact shadow at the base
      const sg = ctx.createLinearGradient(0, b.y - Hs * 0.25, 0, b.y);
      sg.addColorStop(0, "rgba(30,24,18,0)");
      sg.addColorStop(1, "rgba(30,24,18,0.45)");
      ctx.fillStyle = sg;
      ctx.fillRect(b.x - R * 1.3, b.y - Hs * 0.25, R * 2.6, Hs * 0.25);
      ctx.restore();
      // Specular rim along the top
      ctx.strokeStyle = "rgba(255,246,228,0.5)";
      ctx.lineWidth = Math.max(1, 0.05 * b.k);
      ctx.beginPath();
      for (let i = 9; i <= 19; i++) (i === 9 ? ctx.moveTo(pts[i].x, pts[i].y + 1.5) : ctx.lineTo(pts[i].x, pts[i].y + 1.5));
      ctx.stroke();
    }
    // Glass screen in front of the rock: faint panes with streaks of reflected light
    const x0 = -9.5;
    const x1 = -1.3;
    const zg = -0.7;
    const top0 = project(c, x0, 1.15, zg);
    const top1 = project(c, x1, 1.15, zg);
    const bot0 = project(c, x0, 0, zg);
    const bot1 = project(c, x1, 0, zg);
    const pane = ctx.createLinearGradient(0, top1.y, 0, bot1.y);
    pane.addColorStop(0, "rgba(215,236,242,0.16)");
    pane.addColorStop(1, "rgba(215,236,242,0.05)");
    ctx.fillStyle = pane;
    poly(ctx, [bot0, bot1, top1, top0]);
    ctx.fill();
    ctx.save();
    poly(ctx, [bot0, bot1, top1, top0]);
    ctx.clip();
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 2;
    for (let t = 0.08; t < 1; t += 0.23) {
      const a = project(c, x0 + (x1 - x0) * t, 1.15, zg);
      const bb = project(c, x0 + (x1 - x0) * (t + 0.06), 0, zg);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(bb.x, bb.y);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(230,199,127,0.7)";
    ctx.lineWidth = 1;
    for (let t = 0; t <= 1.001; t += 1 / 5) {
      const a = project(c, x0 + (x1 - x0) * t, 1.15, zg);
      const f = project(c, x0 + (x1 - x0) * t, 0, zg);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(f.x, f.y);
      ctx.stroke();
    }
    ctx.strokeStyle = "#e6c77f";
    ctx.lineWidth = Math.max(1.4, 0.06 * top1.k);
    ctx.beginPath();
    ctx.moveTo(top0.x, top0.y);
    ctx.lineTo(top1.x, top1.y);
    ctx.stroke();
  }

  // ─── Moving pilgrims ────────────────────────────────────────────────────────

  drawDynamic(back: CanvasRenderingContext2D, front: CanvasRenderingContext2D) {
    const c = this.cam;
    const order = this.figs.map((f, i) => [i, f.z] as const).sort((a, b) => b[1] - a[1]);
    for (const [i] of order) {
      const f = this.figs[i];
      const b = project(c, f.x, 0, f.z);
      if (b.d <= 2) continue;
      this.figure(back, b, f);
    }
    if (this.walker) this.drawWalker(front, c);
  }

  private figure(ctx: CanvasRenderingContext2D, b: P2, f: Fig) {
    const k = b.k;
    const hgt = f.h * k;
    const w = Math.max(1, 0.5 * k);
    const x = b.x;
    if (k < 7) {
      const y = b.y;
      ctx.fillStyle = "rgba(40,32,20,0.16)";
      ctx.fillRect(x - w * 0.7, y - w * 0.16, w * 1.4, w * 0.32);
      ctx.fillStyle = BODY[f.c];
      ctx.fillRect(x - w / 2, y - hgt * 0.86, w, hgt * 0.86);
      ctx.fillStyle = COVER[f.c] ?? SKIN[f.skin];
      ctx.fillRect(x - w * 0.3, y - hgt, w * 0.6, Math.max(1, hgt * 0.14));
      return;
    }
    // Close up: a walking bob, shoulders, a head, a reflection in the marble
    const bob = Math.abs(Math.sin(f.z * 2.4 + f.ph)) * 0.035 * k;
    const y = b.y - bob;
    const bodyH = hgt * 0.8;
    const shape = (dir: 1 | -1, base: number) => {
      ctx.beginPath();
      ctx.moveTo(x - w * 0.4, base);
      ctx.lineTo(x - w * 0.52, base - dir * bodyH * 0.7);
      ctx.quadraticCurveTo(x - w * 0.52, base - dir * bodyH, x - w * 0.14, base - dir * bodyH);
      ctx.lineTo(x + w * 0.14, base - dir * bodyH);
      ctx.quadraticCurveTo(x + w * 0.52, base - dir * bodyH, x + w * 0.52, base - dir * bodyH * 0.7);
      ctx.lineTo(x + w * 0.4, base);
      ctx.closePath();
    };
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = BODY[f.c];
    shape(-1, b.y);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(40,32,20,0.2)";
    ctx.beginPath();
    ctx.ellipse(x, b.y, w * 0.7, w * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = BODY[f.c];
    shape(1, y);
    ctx.fill();
    // Shade on the far side, and the fold of the upper cloth for men in ihram
    ctx.fillStyle = "rgba(70,58,40,0.13)";
    ctx.fillRect(x + w * 0.12, y - bodyH * 0.92, w * 0.38, bodyH * 0.9);
    if (f.c <= 1) {
      ctx.strokeStyle = "rgba(120,105,80,0.35)";
      ctx.lineWidth = Math.max(0.8, 0.02 * k);
      ctx.beginPath();
      ctx.moveTo(x - w * 0.36, y - bodyH * 0.92);
      ctx.quadraticCurveTo(x, y - bodyH * 0.62, x + w * 0.44, y - bodyH * 0.42);
      ctx.stroke();
    }
    const hr = Math.max(1.2, 0.115 * k);
    const hy = y - bodyH - hr * 0.8;
    const cover = COVER[f.c];
    ctx.fillStyle = cover ?? SKIN[f.skin];
    ctx.beginPath();
    ctx.arc(x, hy, hr, 0, Math.PI * 2);
    ctx.fill();
    if (!cover) {
      ctx.fillStyle = "#231a14";
      ctx.beginPath();
      ctx.arc(x, hy, hr, Math.PI * 1.05, Math.PI * 1.95);
      ctx.fill();
    }
  }

  private drawWalker(ctx: CanvasRenderingContext2D, c: Camera) {
    const n = Math.min(6, Math.floor(this.walker!.traveled));
    const x = n % 2 === 0 ? -4.5 : 4.5;
    const z = this.walkerZ();
    const p = project(c, x, 0, z);
    const hgt = 1.8 * p.k;
    const ring: P2[] = [];
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ring.push(project(c, x + Math.cos(a) * 1.3, 0.02, z + Math.sin(a) * 1.3));
    }
    ctx.strokeStyle = `rgba(255,214,130,${(0.55 + Math.sin(this.t * 4) * 0.25).toFixed(3)})`;
    ctx.lineWidth = 1.6;
    poly(ctx, ring);
    ctx.stroke();
    glow(ctx, p.x, p.y - hgt / 2, Math.max(18, 2.6 * p.k), "rgba(255,226,150,0.7)");
    const top = project(c, x, 7, z);
    const beam = ctx.createLinearGradient(0, top.y, 0, p.y - hgt);
    beam.addColorStop(0, "rgba(255,226,160,0)");
    beam.addColorStop(1, "rgba(255,226,160,0.55)");
    ctx.fillStyle = beam;
    const bw = Math.max(2, 0.26 * p.k);
    ctx.fillRect(p.x - bw / 2, top.y, bw, p.y - hgt - top.y);
    ctx.fillStyle = "#fff6dc";
    ctx.fillRect(p.x - 0.28 * p.k, p.y - hgt * 0.85, 0.56 * p.k, hgt * 0.85);
    ctx.fillStyle = "#f0c860";
    ctx.beginPath();
    ctx.arc(p.x, p.y - hgt * 0.93, Math.max(1.6, 0.26 * p.k), 0, Math.PI * 2);
    ctx.fill();
  }
}
