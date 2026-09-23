import { glow, makeCamera, poly, project, rng, type Camera, type Hints, type P2, type Scene, type SceneLabel, type WalkState } from "./engine";

/**
 * Tawaf, at night, from high above the north-north-east of the Mataf looking
 * south: the door face of the Kaaba towards us, Hijr Ismail to the right,
 * Maqam Ibrahim in front, the domed Ottoman arcades and the newer galleries
 * around the courtyard, minarets, and the clock tower rising behind - the
 * view of the classic photographs.
 *
 * World units are metres: x east, y up, z south. The Kaaba's corners point
 * roughly to the compass (the Black Stone is the east corner); its walls are
 * about 12 x 10 m and 13 m high. Pilgrims walk anticlockwise seen from above.
 */

const TAU = Math.PI * 2;
const H = 13.1;
const N1: [number, number] = [Math.SQRT1_2, -Math.SQRT1_2]; // NE (door) wall normal
const N2: [number, number] = [-Math.SQRT1_2, -Math.SQRT1_2]; // NW (Hijr) wall normal
const A = 5;
const B = 6;
const corner = (s1: number, s2: number): [number, number] => [A * s1 * N1[0] + B * s2 * N2[0], A * s1 * N1[1] + B * s2 * N2[1]];
const EAST = corner(1, -1); // the Black Stone corner
const NORTH = corner(1, 1);
const WEST = corner(-1, 1);
const SOUTH = corner(-1, -1); // the Yemeni corner
const HIJR_C: [number, number] = [(B + 2.78) * N2[0], (B + 2.78) * N2[1]];
const HIJR_R = 5.72;
const HIJR_T = 1.5;
const HIJR_H = 1.3;
const T_NW: [number, number] = [(WEST[0] - NORTH[0]) / 10, (WEST[1] - NORTH[1]) / 10];
const MAQAM: [number, number] = [(A + 11) * N1[0], (A + 11) * N1[1]];
const START_ANGLE = Math.atan2(EAST[1], EAST[0]);
const WALK_R = 21;
const MATAF_R = 52;
const PORTICO_R = 64; // Ottoman arcades
const GALLERY_R = 82; // the newer multi-storey galleries
const GH = 26; // their height

/** Hours and minutes in Makkah right now, for the dial on the clock tower. */
function makkahTime(): [number, number] {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Riyadh", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
    return [get("hour"), get("minute")];
  } catch {
    return [10, 10];
  }
}

type Fig = { r: number; th: number; v: number; ph: number; wob: number; c: number; h: number };

// Body colours: white ihram, off-white, black abaya, beige, grey. Heads: skin, black, white.
const BODY = ["#fbf8f1", "#ece4d6", "#141414", "#cdbf9f", "#80898a"];
const HEAD_OF = [0, 0, 1, 1, 0];
const HEADS = ["#9c7456", "#171717", "#f4f1ea"];

export class TawafScene implements Scene {
  id = "tawaf" as const;
  fade = 0.5;
  private cam!: Camera;
  private w = 0;
  private h = 0;
  private figs: Fig[] = [];
  private t = 0;
  private walker: { traveled: number; done: boolean } | null = null;
  private walkState: WalkState | null = null;
  private kaabaDepth = 0;

  constructor(
    private hints: Hints,
    private density = 1,
  ) {}

  layout(w: number, h: number): SceneLabel[] {
    this.w = w;
    this.h = h;
    this.cam = makeCamera({ w, h, az: (-70 * Math.PI) / 180, pitch: (34 * Math.PI) / 180, dist: 98, target: [-1, 0, 6], fov: (44 * Math.PI) / 180, cy: h * 0.64 });
    this.kaabaDepth = project(this.cam, 0, H / 2, 0).d;
    if (!this.figs.length) this.seed();
    const c = this.cam;
    const u = w / 560;
    const bs = project(c, EAST[0], 1.4, EAST[1]);
    const mq = project(c, MAQAM[0], 2.4, MAQAM[1]);
    const apex = project(c, HIJR_C[0] + N2[0] * (HIJR_R + HIJR_T), HIJR_H, HIJR_C[1] + N2[1] * (HIJR_R + HIJR_T));
    const door = project(c, EAST[0] + (NORTH[0] - EAST[0]) * 0.36, 4.4, EAST[1] + (NORTH[1] - EAST[1]) * 0.36);
    const line = project(c, Math.cos(START_ANGLE) * 27, 0, Math.sin(START_ANGLE) * 27);
    const arrow = project(c, Math.cos(-1.02) * 45, 0, Math.sin(-1.02) * 45);
    // Labels sit clear of the Kaaba; a leader line joins each to what it names.
    const away = (id: string, text: string, p: { x: number; y: number }, dx: number, dy: number, anchor: SceneLabel["anchor"]): SceneLabel => ({
      id,
      text,
      x: p.x + dx * u,
      y: p.y + dy * u,
      anchor,
      px: p.x,
      py: p.y,
    });
    return [
      away("door", "Door of the Kaaba", door, -58, -66, "above"),
      away("bs", "Black Stone", bs, -70, -16, "left"),
      away("mq", "Maqam Ibrahim", mq, 34, 58, "center"),
      away("hijr", "Hijr Ismail", apex, 50, 34, "right"),
      { id: "line", text: "Start of each circuit", x: line.x, y: line.y, anchor: "below", tone: "gold" },
      { id: "dir", text: "Anticlockwise", x: arrow.x, y: arrow.y + 14, anchor: "center", tone: "gold" },
    ];
  }

  private seed() {
    const r = rng(7);
    const n = Math.round((this.w > 500 ? 3600 : 1700) * this.density);
    this.figs = Array.from({ length: n }, () => {
      const roll = r();
      return {
        r: 9.4 + 40 * Math.pow(r(), 2.05),
        th: r() * TAU,
        v: 1.9 + r() * 1.3,
        ph: r() * TAU,
        wob: r() * 0.8,
        c: roll < 0.68 ? 0 : roll < 0.76 ? 1 : roll < 0.92 ? 2 : roll < 0.96 ? 3 : 4,
        h: 1.55 + r() * 0.3,
      };
    });
  }

  /** Pilgrims flow around Hijr Ismail, never through it. */
  private radiusAt(r: number, th: number) {
    const d = Math.atan2(Math.sin(th + Math.PI * 0.75), Math.cos(th + Math.PI * 0.75));
    if (Math.abs(d) < 0.95) return Math.max(r, 16.8 + (1 - Math.abs(d) / 0.95) * 1.4);
    return r;
  }

  step(dt: number, t: number) {
    this.t = t;
    for (const f of this.figs) f.th -= (f.v / f.r) * dt; // anticlockwise seen from above
    const w = this.walker;
    if (w) {
      if (!w.done) {
        w.traveled = Math.min(7 * TAU, w.traveled + (TAU / 8) * dt);
        if (w.traveled >= 7 * TAU) w.done = true;
      }
      const count = w.done ? 7 : Math.floor(w.traveled / TAU) + 1;
      const phi = w.traveled % TAU;
      const h = this.hints;
      const hint = w.done ? h.tawafDone : phi < 0.5 ? h.blackStone : phi > TAU * 0.75 ? h.rabbana : h.freely;
      this.walkState = { kind: "tawaf", count, hint, done: w.done };
    }
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
    bg.fillStyle = "#040c0e";
    bg.fillRect(0, 0, W, Hh);
    this.drawSkyline(bg, W, Hh);
    this.drawMinarets(bg, c);
    this.drawGalleries(bg, c);
    this.drawPortico(bg, c);
    this.drawFloor(bg, c, W, Hh);
    this.drawHijr(mid, c);
    this.drawKaaba(mid, c);
    this.drawMaqam(mid, c);
  }

  /** Mecca at night behind the Haram: hotel towers, and the Abraj Al-Bait clock tower rising over them. */
  private drawSkyline(bg: CanvasRenderingContext2D, W: number, Hh: number) {
    const u = W / 560;
    const behind = project(this.cam, Math.cos(1.92) * GALLERY_R, GH, Math.sin(1.92) * GALLERY_R);
    const hz = behind.y + 8 * u; // the skyline's feet are hidden by the galleries
    const cx = behind.x; // seen from the north-east, the tower stands behind the Kaaba
    const sky = bg.createLinearGradient(0, 0, 0, hz);
    sky.addColorStop(0, "#02080a");
    sky.addColorStop(1, "#0d1915");
    bg.fillStyle = sky;
    bg.fillRect(0, 0, W, hz + 2);
    glow(bg, cx, hz, W * 0.75, "rgba(255,214,150,0.12)");
    const r = rng(19);
    // The city: hotel towers either side of the Abraj complex
    for (let i = 0; i < 34; i++) {
      const x = (i / 33) * W * 1.1 - W * 0.05 + (r() - 0.5) * 14 * u;
      const bw = (18 + r() * 24) * u;
      const bh = (22 + r() * 58) * u * (Math.abs(x - cx) < 190 * u ? 1.25 : 1);
      if (Math.abs(x - cx) < 150 * u) continue;
      this.building(bg, x, hz, bw, bh, u, r, false);
    }
    // The six hotel towers of the Abraj Al-Bait, three either side of the clock
    for (const [dx, bw, bh] of [
      [-126, 38, 84],
      [-90, 42, 112],
      [-56, 36, 98],
      [56, 36, 98],
      [90, 42, 112],
      [126, 38, 84],
    ]) {
      this.building(bg, cx + dx * u, hz, bw * u, bh * u, u, r, true);
    }
    this.drawClockTower(bg, cx, hz, u);
    void Hh;
  }

  /** One lit tower block: a facade, a fine grid of windows, a crown of light. */
  private building(bg: CanvasRenderingContext2D, x: number, base: number, bw: number, bh: number, u: number, r: () => number, crowned: boolean) {
    const top = base - bh;
    const g = bg.createLinearGradient(x - bw / 2, 0, x + bw / 2, 0);
    g.addColorStop(0, crowned ? "#3b3a34" : "#18221f");
    g.addColorStop(0.45, crowned ? "#6f6a5d" : "#27332e");
    g.addColorStop(1, crowned ? "#2e2d28" : "#141c19");
    bg.fillStyle = g;
    bg.fillRect(x - bw / 2, top, bw, bh + 4 * u);
    const lit = crowned ? 0.7 : 0.5;
    for (let yy = top + 5 * u; yy < base; yy += 3.4 * u) {
      for (let xx = x - bw / 2 + 2.5 * u; xx < x + bw / 2 - 2 * u; xx += 3 * u) {
        const q = r();
        if (q > lit) continue;
        bg.fillStyle = q < 0.08 ? "rgba(210,232,255,0.55)" : q < lit * 0.55 ? "rgba(255,226,170,0.62)" : "rgba(255,206,140,0.34)";
        bg.fillRect(xx, yy, 1.4 * u, 1.5 * u);
      }
    }
    if (crowned) {
      bg.fillStyle = "#b8ad95";
      bg.beginPath();
      bg.moveTo(x - bw / 2, top);
      bg.lineTo(x - bw * 0.3, top - 10 * u);
      bg.lineTo(x + bw * 0.3, top - 10 * u);
      bg.lineTo(x + bw / 2, top);
      bg.closePath();
      bg.fill();
      bg.fillStyle = "rgba(255,236,190,0.9)";
      bg.fillRect(x - bw / 2, top - 1 * u, bw, 1.4 * u);
      bg.fillStyle = "#e6c77f";
      bg.fillRect(x - 0.8 * u, top - 22 * u, 1.6 * u, 12 * u);
      glow(bg, x, top - 22 * u, 8 * u, "rgba(245,215,145,0.8)");
    } else if (r() < 0.4) {
      bg.fillStyle = "rgba(255,220,160,0.5)";
      bg.fillRect(x - bw / 2, top, bw, 1.2 * u);
    }
  }

  /** The Abraj Al-Bait clock: floodlit stone, the white dial ringed in green, the gilded lantern. */
  private drawClockTower(bg: CanvasRenderingContext2D, cx: number, hz: number, u: number) {
    const shaftTop = hz - 46 * u;
    const blockTop = shaftTop - 58 * u;
    const lanternTop = blockTop - 52 * u;
    glow(bg, cx, blockTop + 20 * u, 150 * u, "rgba(200,240,215,0.16)");
    // Shaft, floodlit from below
    const sg = bg.createLinearGradient(cx - 36 * u, 0, cx + 36 * u, 0);
    sg.addColorStop(0, "#35342e");
    sg.addColorStop(0.3, "#a79d88");
    sg.addColorStop(0.55, "#d6ccb6");
    sg.addColorStop(1, "#302f2a");
    bg.fillStyle = sg;
    bg.beginPath();
    bg.moveTo(cx - 38 * u, hz + 4 * u);
    bg.lineTo(cx - 33 * u, shaftTop);
    bg.lineTo(cx + 33 * u, shaftTop);
    bg.lineTo(cx + 38 * u, hz + 4 * u);
    bg.closePath();
    bg.fill();
    bg.strokeStyle = "rgba(60,55,45,0.35)";
    bg.lineWidth = 0.8 * u;
    for (const f of [-0.62, -0.3, 0, 0.3, 0.62]) {
      bg.beginPath();
      bg.moveTo(cx + 38 * u * f, hz);
      bg.lineTo(cx + 33 * u * f, shaftTop);
      bg.stroke();
    }
    // Clock block with corner turrets
    const bw = 42 * u;
    const bgc = bg.createLinearGradient(cx - bw, 0, cx + bw, 0);
    bgc.addColorStop(0, "#3a3831");
    bgc.addColorStop(0.5, "#c9bea6");
    bgc.addColorStop(1, "#35332d");
    bg.fillStyle = bgc;
    bg.fillRect(cx - bw, blockTop, bw * 2, shaftTop - blockTop);
    for (const sx of [-1, 1]) {
      const tx = cx + sx * (bw - 4 * u);
      bg.fillStyle = "#cfc4ab";
      bg.fillRect(tx - 4 * u, blockTop - 10 * u, 8 * u, shaftTop - blockTop + 10 * u);
      bg.fillStyle = "#e6c77f";
      bg.beginPath();
      bg.moveTo(tx - 4 * u, blockTop - 10 * u);
      bg.lineTo(tx, blockTop - 20 * u);
      bg.lineTo(tx + 4 * u, blockTop - 10 * u);
      bg.closePath();
      bg.fill();
    }
    // The dial, showing the time in Makkah now
    const dy = (blockTop + shaftTop) / 2 + 3 * u;
    const R = 21 * u;
    glow(bg, cx, dy, 64 * u, "rgba(225,250,235,0.5)");
    bg.fillStyle = "#f5f8f1";
    bg.beginPath();
    bg.arc(cx, dy, R, 0, TAU);
    bg.fill();
    bg.strokeStyle = "#2c9c6c";
    bg.lineWidth = 2 * u;
    bg.stroke();
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * TAU;
      const big = i % 5 === 0;
      bg.fillStyle = big ? "rgba(40,190,120,1)" : "rgba(90,235,160,0.8)";
      const rr = R + 4.4 * u;
      const sz = (big ? 2.2 : 1.1) * u;
      bg.fillRect(cx + Math.cos(a) * rr - sz / 2, dy + Math.sin(a) * rr - sz / 2, sz, sz);
    }
    bg.fillStyle = "#1f2a25";
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU;
      bg.save();
      bg.translate(cx + Math.cos(a) * R * 0.8, dy + Math.sin(a) * R * 0.8);
      bg.rotate(a);
      bg.fillRect(-2.2 * u, -0.6 * u, 4.4 * u, 1.2 * u);
      bg.restore();
    }
    const [hh, mm] = makkahTime();
    const hand = (a: number, len: number, wdt: number) => {
      bg.strokeStyle = "#16201c";
      bg.lineWidth = wdt;
      bg.lineCap = "round";
      bg.beginPath();
      bg.moveTo(cx, dy);
      bg.lineTo(cx + Math.sin(a) * len, dy - Math.cos(a) * len);
      bg.stroke();
      bg.lineCap = "butt";
    };
    hand(((hh % 12) + mm / 60) * (TAU / 12), R * 0.52, 2 * u);
    hand(mm * (TAU / 60), R * 0.78, 1.3 * u);
    // Green-lit inscription band above the dial
    bg.fillStyle = "rgba(70,230,150,0.9)";
    for (let i = -6; i <= 6; i++) bg.fillRect(cx + i * 3.4 * u - 1 * u, blockTop + 5 * u + (i % 2 ? 1 : 0) * u, 2 * u, 3 * u);
    glow(bg, cx, blockTop + 6 * u, 26 * u, "rgba(70,230,150,0.35)");
    // Gilded lantern tapering to the spire
    const lg = bg.createLinearGradient(cx - 34 * u, 0, cx + 34 * u, 0);
    lg.addColorStop(0, "#6b5427");
    lg.addColorStop(0.5, "#f3dca4");
    lg.addColorStop(1, "#5f4a22");
    bg.fillStyle = lg;
    bg.beginPath();
    bg.moveTo(cx - 34 * u, blockTop);
    bg.lineTo(cx - 10 * u, lanternTop);
    bg.lineTo(cx + 10 * u, lanternTop);
    bg.lineTo(cx + 34 * u, blockTop);
    bg.closePath();
    bg.fill();
    for (let yy = blockTop - 7 * u, i = 0; yy > lanternTop + 3 * u; yy -= 7 * u, i++) {
      const f = (blockTop - yy) / (blockTop - lanternTop);
      const hw = 34 * u + (10 * u - 34 * u) * f;
      bg.fillStyle = i % 2 ? "rgba(255,248,225,0.9)" : "rgba(110,240,170,0.75)";
      bg.fillRect(cx - hw * 0.86, yy, hw * 1.72, 1.2 * u);
    }
    bg.fillStyle = "#f0d596";
    bg.beginPath();
    bg.moveTo(cx - 3 * u, lanternTop);
    bg.lineTo(cx - 1 * u, lanternTop - 90 * u);
    bg.lineTo(cx + 1 * u, lanternTop - 90 * u);
    bg.lineTo(cx + 3 * u, lanternTop);
    bg.closePath();
    bg.fill();
    glow(bg, cx, lanternTop, 30 * u, "rgba(245,220,160,0.5)");
  }

  /** Far half of a ring, split into segments, sorted far to near. */
  private ringSegments(radius: number, count: number, minDepth: number) {
    const segs = [];
    for (let i = 0; i < count; i++) {
      const a0 = (i / count) * TAU;
      const a1 = ((i + 1) / count) * TAU;
      const am = (a0 + a1) / 2;
      const m = project(this.cam, Math.cos(am) * radius, 0, Math.sin(am) * radius);
      if (m.d < minDepth) continue;
      segs.push({ a0, a1, am, d: m.d });
    }
    return segs.sort((a, b) => b.d - a.d);
  }

  /** The newer multi-storey galleries: marble, three tiers of lit arches, floodlit from the courtyard. */
  private drawGalleries(bg: CanvasRenderingContext2D, c: Camera) {
    const P = (a: number, rad: number, y: number) => project(c, Math.cos(a) * rad, y, Math.sin(a) * rad);
    let yTop = Infinity;
    let yBase = -Infinity;
    const segs = this.ringSegments(GALLERY_R, 128, this.kaabaDepth - 30);
    segs.forEach((s, idx) => {
      const face = [P(s.a0, GALLERY_R, 0), P(s.a1, GALLERY_R, 0), P(s.a1, GALLERY_R, GH), P(s.a0, GALLERY_R, GH)];
      yTop = Math.min(yTop, face[2].y, face[3].y);
      yBase = Math.max(yBase, face[0].y, face[1].y);
      const g = bg.createLinearGradient(0, face[2].y, 0, face[0].y);
      g.addColorStop(0, "#77715f");
      g.addColorStop(1, "#c9c0ab");
      bg.fillStyle = g;
      poly(bg, face);
      bg.fill();
      for (const [y0, y1] of [
        [1.4, 7.6],
        [9.6, 15.4],
        [17.4, 22.6],
      ]) {
        const b0 = s.a0 + (s.a1 - s.a0) * 0.24;
        const b1 = s.a1 - (s.a1 - s.a0) * 0.24;
        const p0 = P(b0, GALLERY_R - 0.3, y0);
        const p1 = P(b1, GALLERY_R - 0.3, y0);
        const p2 = P(b1, GALLERY_R - 0.3, y1 - 1.8);
        const p3 = P(b0, GALLERY_R - 0.3, y1 - 1.8);
        const tp = P(s.am, GALLERY_R - 0.3, y1);
        const lg = bg.createLinearGradient(0, tp.y, 0, p0.y);
        lg.addColorStop(0, "rgba(255,243,220,0.95)");
        lg.addColorStop(1, "rgba(214,165,98,0.82)");
        bg.fillStyle = lg;
        bg.beginPath();
        bg.moveTo(p0.x, p0.y);
        bg.lineTo(p1.x, p1.y);
        bg.lineTo(p2.x, p2.y);
        bg.quadraticCurveTo(tp.x, tp.y - (p2.y - tp.y) * 0.5, p3.x, p3.y);
        bg.closePath();
        bg.fill();
      }
      // Lit balcony edges between the floors, and lamps along the roof parapet
      bg.strokeStyle = "rgba(255,232,190,0.45)";
      bg.lineWidth = 1;
      for (const y of [8.8, 16.6, GH]) {
        const k0 = P(s.a0, GALLERY_R, y);
        const k1 = P(s.a1, GALLERY_R, y);
        bg.beginPath();
        bg.moveTo(k0.x, k0.y);
        bg.lineTo(k1.x, k1.y);
        bg.stroke();
      }
      if (idx % 2 === 0) {
        const lamp = P(s.am, GALLERY_R, GH + 2.2);
        glow(bg, lamp.x, lamp.y, Math.max(4, 1.6 * lamp.k), "rgba(255,236,190,0.7)");
      }
    });
    // Floodlight haze over the far side of the courtyard
    if (yTop < yBase) {
      const hz = bg.createLinearGradient(0, yTop, 0, yBase);
      hz.addColorStop(0, "rgba(255,240,215,0)");
      hz.addColorStop(1, "rgba(255,240,215,0.22)");
      bg.fillStyle = hz;
      bg.fillRect(0, yTop, this.w, yBase - yTop);
    }
  }

  /**
   * The two minarets of the King Abdulaziz Gate, framing the clock tower as
   * in the classic photographs. Drawn upright on screen (as an architectural
   * photographer would correct them), with balconies, a columned crown, a
   * gilded cone and a crescent.
   */
  private drawMinarets(bg: CanvasRenderingContext2D, c: Camera) {
    for (const deg of [97, 123]) {
      const a = (deg * Math.PI) / 180;
      const x = Math.cos(a) * (GALLERY_R + 4);
      const z = Math.sin(a) * (GALLERY_R + 4);
      const b = project(c, x, 0, z);
      const X = b.x;
      const Y = (y: number) => project(c, x, y, z).y;
      const k = b.k;
      const w0 = 3.2 * k;
      const w1 = 2.4 * k;
      const shaftTop = Y(44);
      glow(bg, X, shaftTop, 22 * k, "rgba(245,226,180,0.14)");
      const g = bg.createLinearGradient(X - w0 / 2, 0, X + w0 / 2, 0);
      g.addColorStop(0, "#8e8878");
      g.addColorStop(0.35, "#fbf5e6");
      g.addColorStop(0.6, "#e4dcc9");
      g.addColorStop(1, "#7c7667");
      bg.fillStyle = g;
      bg.beginPath();
      bg.moveTo(X - w0 / 2, b.y);
      bg.lineTo(X - w1 / 2, shaftTop);
      bg.lineTo(X + w1 / 2, shaftTop);
      bg.lineTo(X + w0 / 2, b.y);
      bg.closePath();
      bg.fill();
      bg.strokeStyle = "rgba(120,110,90,0.4)";
      bg.lineWidth = 0.6;
      for (const f of [-0.2, 0.2]) {
        bg.beginPath();
        bg.moveTo(X + w0 * f, b.y);
        bg.lineTo(X + w1 * f, shaftTop);
        bg.stroke();
      }
      // Balconies with lit railings
      for (const yb of [30, 38]) {
        const yy = Y(yb);
        const ww = (w0 + (w1 - w0) * (yb / 44)) * 1.8;
        bg.fillStyle = "#f4eedf";
        bg.beginPath();
        bg.ellipse(X, yy, ww / 2, Math.max(1, ww * 0.12), 0, 0, TAU);
        bg.fill();
        bg.fillStyle = "rgba(255,222,150,0.95)";
        bg.fillRect(X - ww * 0.42, yy - Math.max(1.4, ww * 0.16), ww * 0.84, Math.max(0.8, ww * 0.06));
        glow(bg, X, yy, ww, "rgba(255,220,150,0.3)");
      }
      // Columned crown, lit gold inside
      const c0 = shaftTop;
      const c1 = Y(48.5);
      const cw = w1 * 1.3;
      bg.fillStyle = "rgba(255,214,140,0.95)";
      bg.fillRect(X - cw / 2, c1, cw, c0 - c1);
      bg.fillStyle = "#f4eedf";
      for (const f of [-0.5, 0, 0.5]) bg.fillRect(X + (cw / 2) * f - 0.5, c1, 1, c0 - c1);
      bg.fillRect(X - cw * 0.62, c1 - 1.2, cw * 1.24, 1.6);
      // Gilded cone and crescent
      const tip = Y(55);
      const cone = bg.createLinearGradient(X - cw / 2, 0, X + cw / 2, 0);
      cone.addColorStop(0, "#9a7a3c");
      cone.addColorStop(0.45, "#f3dca4");
      cone.addColorStop(1, "#8f6a2a");
      bg.fillStyle = cone;
      bg.beginPath();
      bg.moveTo(X - cw * 0.55, c1 - 1.2);
      bg.lineTo(X, tip);
      bg.lineTo(X + cw * 0.55, c1 - 1.2);
      bg.closePath();
      bg.fill();
      bg.fillStyle = "#e6c77f";
      bg.fillRect(X - 0.6, tip - 0.9 * k, 1.2, 0.9 * k);
      glow(bg, X, tip - 1.6 * k, 5 * k, "rgba(245,215,145,0.6)");
      const cr = 0.62 * k;
      bg.strokeStyle = "#f6e3b4";
      bg.lineWidth = Math.max(1, cr * 0.42);
      bg.beginPath();
      bg.arc(X, tip - 0.9 * k - cr, cr, Math.PI * 0.15, Math.PI * 0.85, true);
      bg.stroke();
    }
  }

  /** The Ottoman arcades around the Mataf: columns, pointed arches and small domes. */
  private drawPortico(bg: CanvasRenderingContext2D, c: Camera) {
    const P = (a: number, rad: number, y: number) => project(c, Math.cos(a) * rad, y, Math.sin(a) * rad);
    for (const s of this.ringSegments(PORTICO_R, 78, this.kaabaDepth - 22)) {
      const face = [P(s.a0, PORTICO_R, 0), P(s.a1, PORTICO_R, 0), P(s.a1, PORTICO_R, 8.6), P(s.a0, PORTICO_R, 8.6)];
      bg.fillStyle = "#e8dfcc";
      poly(bg, face);
      bg.fill();
      // Arch opening with the warm lit interior
      const b0 = s.a0 + (s.a1 - s.a0) * 0.14;
      const b1 = s.a1 - (s.a1 - s.a0) * 0.14;
      const p0 = P(b0, PORTICO_R - 0.2, 0);
      const p1 = P(b1, PORTICO_R - 0.2, 0);
      const p2 = P(b1, PORTICO_R - 0.2, 5.2);
      const p3 = P(b0, PORTICO_R - 0.2, 5.2);
      const tp = P(s.am, PORTICO_R - 0.2, 7.4);
      const ig = bg.createLinearGradient(0, tp.y, 0, p0.y);
      ig.addColorStop(0, "rgba(255,214,140,0.95)");
      ig.addColorStop(1, "rgba(150,95,40,0.95)");
      bg.fillStyle = ig;
      bg.beginPath();
      bg.moveTo(p0.x, p0.y);
      bg.lineTo(p1.x, p1.y);
      bg.lineTo(p2.x, p2.y);
      bg.quadraticCurveTo((p2.x + tp.x) / 2, tp.y, tp.x, tp.y);
      bg.quadraticCurveTo((p3.x + tp.x) / 2, tp.y, p3.x, p3.y);
      bg.closePath();
      bg.fill();
      // Small dome on each bay
      const dc = P(s.am, PORTICO_R - 1.8, 8.6);
      const rx = Math.max(2, 2.3 * dc.k);
      const dg = bg.createRadialGradient(dc.x - rx * 0.3, dc.y - rx * 0.6, 1, dc.x, dc.y - rx * 0.3, rx * 1.2);
      dg.addColorStop(0, "#d6d3ca");
      dg.addColorStop(1, "#6f6d66");
      bg.fillStyle = dg;
      bg.beginPath();
      bg.ellipse(dc.x, dc.y, rx, rx * 0.95, 0, Math.PI, 0);
      bg.fill();
      bg.fillStyle = "#d4ab5a";
      bg.fillRect(dc.x - 0.6, dc.y - rx * 0.95 - Math.max(2, 0.9 * dc.k), 1.2, Math.max(2, 0.9 * dc.k));
    }
  }

  /** The Mataf: white marble under floodlights, with faint rings. */
  private drawFloor(bg: CanvasRenderingContext2D, c: Camera, W: number, Hh: number) {
    const ring = (rad: number, n = 120) => {
      const pts: P2[] = [];
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * TAU;
        const p = project(c, Math.cos(a) * rad, 0, Math.sin(a) * rad);
        if (p.d > 5) pts.push(p);
      }
      return pts;
    };
    // The floor between the Mataf and the arcades
    const outer = ring(PORTICO_R - 0.5);
    bg.fillStyle = "#8d867a";
    poly(bg, outer);
    bg.fill();
    const k0 = project(c, 0, 0, 0);
    const mataf = ring(MATAF_R);
    const g = bg.createRadialGradient(k0.x, k0.y, 12, k0.x, k0.y, Math.max(W, Hh) * 0.62);
    g.addColorStop(0, "#f6f1e7");
    g.addColorStop(0.45, "#e5dfd2");
    g.addColorStop(1, "#b1a999");
    bg.fillStyle = g;
    poly(bg, mataf);
    bg.fill();
    bg.lineWidth = 1;
    for (const rad of [15, 26, 37, 48]) {
      bg.strokeStyle = "rgba(115,105,90,0.14)";
      poly(bg, ring(rad));
      bg.stroke();
    }
    // Start line from the Black Stone corner outwards
    const l0 = project(c, Math.cos(START_ANGLE) * 8.5, 0.02, Math.sin(START_ANGLE) * 8.5);
    const l1 = project(c, Math.cos(START_ANGLE) * MATAF_R, 0.02, Math.sin(START_ANGLE) * MATAF_R);
    bg.strokeStyle = "rgba(160,112,40,0.85)";
    bg.lineWidth = 2;
    bg.setLineDash([7, 5]);
    bg.beginPath();
    bg.moveTo(l0.x, l0.y);
    bg.lineTo(l1.x, l1.y);
    bg.stroke();
    bg.setLineDash([]);
    // Direction arrow painted on the floor
    const arc: P2[] = [];
    for (let a = -0.5; a >= -1.42; a -= 0.02) arc.push(project(c, Math.cos(a) * 45, 0.02, Math.sin(a) * 45));
    bg.strokeStyle = "rgba(170,120,45,0.85)";
    bg.lineWidth = 3;
    bg.beginPath();
    arc.forEach((p, i) => (i ? bg.lineTo(p.x, p.y) : bg.moveTo(p.x, p.y)));
    bg.stroke();
    const tip = arc[arc.length - 1];
    const prev = arc[arc.length - 4];
    const ang = Math.atan2(tip.y - prev.y, tip.x - prev.x);
    bg.fillStyle = "rgba(170,120,45,0.95)";
    bg.beginPath();
    bg.moveTo(tip.x + Math.cos(ang) * 11, tip.y + Math.sin(ang) * 11);
    bg.lineTo(tip.x + Math.cos(ang + 2.5) * 9, tip.y + Math.sin(ang + 2.5) * 9);
    bg.lineTo(tip.x + Math.cos(ang - 2.5) * 9, tip.y + Math.sin(ang - 2.5) * 9);
    bg.closePath();
    bg.fill();
    glow(bg, k0.x, k0.y, W * 0.36, "rgba(255,246,225,0.4)");
    // Night falls off towards the edges
    const v = bg.createRadialGradient(W / 2, Hh * 0.6, W * 0.32, W / 2, Hh * 0.6, Math.max(W, Hh) * 0.8);
    v.addColorStop(0, "rgba(3,11,9,0)");
    v.addColorStop(1, "rgba(3,11,9,0.8)");
    bg.fillStyle = v;
    bg.fillRect(0, 0, W, Hh);
  }

  private drawHijr(ctx: CanvasRenderingContext2D, c: Camera) {
    const arc = (rad: number, y: number) => {
      const pts = [];
      for (let i = 0; i <= 40; i++) {
        const phi = (-103 + (206 * i) / 40) * (Math.PI / 180);
        const x = HIJR_C[0] + rad * (Math.cos(phi) * N2[0] + Math.sin(phi) * T_NW[0]);
        const z = HIJR_C[1] + rad * (Math.cos(phi) * N2[1] + Math.sin(phi) * T_NW[1]);
        pts.push(project(c, x, y, z));
      }
      return pts;
    };
    const inner0 = arc(HIJR_R, 0);
    const inner1 = arc(HIJR_R, HIJR_H);
    const outer0 = arc(HIJR_R + HIJR_T, 0);
    const outer1 = arc(HIJR_R + HIJR_T, HIJR_H);
    ctx.fillStyle = "#cbc2b3";
    poly(ctx, [...inner0, ...inner1.slice().reverse()]);
    ctx.fill();
    ctx.fillStyle = "#dcd3c4";
    poly(ctx, [...outer0, ...outer1.slice().reverse()]);
    ctx.fill();
    ctx.fillStyle = "#f7f3ea";
    poly(ctx, [...outer1, ...inner1.slice().reverse()]);
    ctx.fill();
    ctx.strokeStyle = "rgba(90,80,65,0.3)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  private drawKaaba(ctx: CanvasRenderingContext2D, c: Camera) {
    const P = (p: [number, number], y: number) => project(c, p[0], y, p[1]);
    const k0 = project(c, 0, H / 2, 0);
    glow(ctx, k0.x, k0.y, 120, "rgba(255,236,200,0.2)");
    const walls: { a: [number, number]; b: [number, number]; n: [number, number]; name: string }[] = [
      { a: EAST, b: NORTH, n: N1, name: "NE" },
      { a: NORTH, b: WEST, n: N2, name: "NW" },
      { a: WEST, b: SOUTH, n: [-N1[0], -N1[1]], name: "SW" },
      { a: SOUTH, b: EAST, n: [-N2[0], -N2[1]], name: "SE" },
    ];
    for (const w of walls) {
      const mid: [number, number] = [(w.a[0] + w.b[0]) / 2, (w.a[1] + w.b[1]) / 2];
      if (w.n[0] * (c.pos[0] - mid[0]) + w.n[1] * (c.pos[2] - mid[1]) <= 0) continue;
      const q = [P(w.a, 0), P(w.b, 0), P(w.b, H), P(w.a, H)];
      const g = ctx.createLinearGradient(0, q[3].y, 0, q[0].y);
      g.addColorStop(0, w.name === "NE" ? "#2b2b30" : "#1d1d21");
      g.addColorStop(0.45, "#101012");
      g.addColorStop(1, "#070708");
      ctx.fillStyle = g;
      poly(ctx, q);
      ctx.fill();
      // Woven kiswah texture
      ctx.save();
      poly(ctx, q);
      ctx.clip();
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let i = -24; i <= 24; i++) {
        const s = i / 24;
        const a = P([w.a[0] + (w.b[0] - w.a[0]) * (0.5 + s), w.a[1] + (w.b[1] - w.a[1]) * (0.5 + s)], 0);
        const b = P([w.a[0] + (w.b[0] - w.a[0]) * (0.5 + s + 0.3), w.a[1] + (w.b[1] - w.a[1]) * (0.5 + s + 0.3)], H);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.restore();
      // The Hizam: gold embroidered belt
      const band = [P(w.a, 8.6), P(w.b, 8.6), P(w.b, 9.55), P(w.a, 9.55)];
      const gb = ctx.createLinearGradient(band[0].x, band[0].y, band[1].x, band[1].y);
      gb.addColorStop(0, "#a8782c");
      gb.addColorStop(0.3, "#f3dca4");
      gb.addColorStop(0.55, "#d4ab5a");
      gb.addColorStop(0.8, "#f0d596");
      gb.addColorStop(1, "#9c6f27");
      ctx.fillStyle = gb;
      poly(ctx, band);
      ctx.fill();
      ctx.strokeStyle = "rgba(60,40,10,0.5)";
      ctx.lineWidth = 0.7;
      for (let i = 1; i < 36; i++) {
        const f = i / 36;
        const x0 = w.a[0] + (w.b[0] - w.a[0]) * f;
        const z0 = w.a[1] + (w.b[1] - w.a[1]) * f;
        const lo = P([x0, z0], 8.72 + ((i * 7) % 3) * 0.08);
        const hi = P([x0, z0], 9.42 - ((i * 5) % 3) * 0.1);
        ctx.beginPath();
        ctx.moveTo(lo.x, lo.y);
        ctx.lineTo(hi.x, hi.y);
        ctx.stroke();
      }
      // Embroidered lamps (qanadeel) under the belt
      for (let i = 1; i <= 4; i++) {
        const f = i / 5;
        const x0 = w.a[0] + (w.b[0] - w.a[0]) * f;
        const z0 = w.a[1] + (w.b[1] - w.a[1]) * f;
        const p = project(c, x0, 7.4, z0);
        ctx.fillStyle = "rgba(212,171,90,0.8)";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, Math.max(0.8, 0.3 * p.k), Math.max(1.4, 0.62 * p.k), 0, 0, TAU);
        ctx.fill();
      }
      // Marble base (Shadharwan)
      ctx.fillStyle = "#ece6d9";
      poly(ctx, [P(w.a, 0), P(w.b, 0), P(w.b, 0.35), P(w.a, 0.35)]);
      ctx.fill();
      if (w.name === "NE") {
        const at = (f: number): [number, number] => [w.a[0] + (w.b[0] - w.a[0]) * f, w.a[1] + (w.b[1] - w.a[1]) * f];
        const d = [P(at(0.28), 2.2), P(at(0.44), 2.2), P(at(0.44), 5.45), P(at(0.28), 5.45)];
        glow(ctx, (d[0].x + d[2].x) / 2, (d[0].y + d[2].y) / 2, 30, "rgba(240,210,140,0.4)");
        const gd = ctx.createLinearGradient(d[3].x, d[3].y, d[1].x, d[1].y);
        gd.addColorStop(0, "#f3dca4");
        gd.addColorStop(0.5, "#c9a052");
        gd.addColorStop(1, "#e6c77f");
        ctx.fillStyle = gd;
        poly(ctx, d);
        ctx.fill();
        ctx.strokeStyle = "rgba(90,60,15,0.7)";
        ctx.lineWidth = 0.8;
        poly(ctx, [P(at(0.3), 2.5), P(at(0.42), 2.5), P(at(0.42), 5.1), P(at(0.3), 5.1)]);
        ctx.stroke();
      }
    }
    const roof = [P(EAST, H), P(NORTH, H), P(WEST, H), P(SOUTH, H)];
    ctx.fillStyle = "#2c2c2e";
    poly(ctx, roof);
    ctx.fill();
    ctx.strokeStyle = "rgba(212,171,90,0.5)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Golden rain spout (Mizab) over Hijr Ismail
    const nwMid: [number, number] = [(NORTH[0] + WEST[0]) / 2, (NORTH[1] + WEST[1]) / 2];
    const s0 = P(nwMid, H - 0.1);
    const s1 = project(c, nwMid[0] + N2[0] * 1.6, H - 0.6, nwMid[1] + N2[1] * 1.6);
    ctx.strokeStyle = "#f0d596";
    ctx.lineWidth = Math.max(1.6, 0.4 * s1.k);
    ctx.beginPath();
    ctx.moveTo(s0.x, s0.y);
    ctx.lineTo(s1.x, s1.y);
    ctx.stroke();
    // The Black Stone in its silver frame
    const bs = project(c, EAST[0], 1.3, EAST[1]);
    glow(ctx, bs.x, bs.y, 10, "rgba(255,255,255,0.35)");
    ctx.fillStyle = "#d9dcdf";
    ctx.beginPath();
    ctx.ellipse(bs.x, bs.y, Math.max(1.6, 0.45 * bs.k), Math.max(2, 0.55 * bs.k), 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#2a2522";
    ctx.beginPath();
    ctx.ellipse(bs.x, bs.y, Math.max(0.8, 0.22 * bs.k), Math.max(1, 0.3 * bs.k), 0, 0, TAU);
    ctx.fill();
  }

  private drawMaqam(ctx: CanvasRenderingContext2D, c: Camera) {
    const b = project(c, MAQAM[0], 0, MAQAM[1]);
    const t = project(c, MAQAM[0], 2.6, MAQAM[1]);
    const w = Math.max(5, 1.5 * b.k);
    glow(ctx, t.x, t.y, 22, "rgba(240,210,140,0.6)");
    const g = ctx.createLinearGradient(b.x - w / 2, 0, b.x + w / 2, 0);
    g.addColorStop(0, "#8f6a2a");
    g.addColorStop(0.45, "#f3dca4");
    g.addColorStop(1, "#a8782c");
    ctx.fillStyle = g;
    ctx.fillRect(b.x - w / 2, t.y, w, b.y - t.y);
    ctx.fillStyle = "rgba(230,240,235,0.9)";
    ctx.beginPath();
    ctx.ellipse(t.x, t.y, w / 2, w * 0.45, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#e6c77f";
    ctx.fillRect(t.x - 0.6, t.y - w * 0.45 - 3, 1.2, 3);
  }

  // ─── Moving pilgrims ────────────────────────────────────────────────────────

  drawDynamic(back: CanvasRenderingContext2D, front: CanvasRenderingContext2D) {
    const c = this.cam;
    // One path per colour and layer, so thousands of pilgrims cost a few fills.
    const batch = () => ({ shade: new Path2D(), side: new Path2D(), body: BODY.map(() => new Path2D()), head: HEADS.map(() => new Path2D()) });
    const layers = { back: batch(), front: batch() };
    const rounded = typeof Path2D.prototype.roundRect === "function";
    for (const f of this.figs) {
      const r = this.radiusAt(f.r + Math.sin(this.t * 0.6 + f.ph) * f.wob, f.th);
      const b = project(c, Math.cos(f.th) * r, 0, Math.sin(f.th) * r);
      const hgt = f.h * b.k;
      const w = Math.max(1.1, 0.44 * b.k);
      const set = b.d > this.kaabaDepth ? layers.back : layers.front;
      const bodyH = hgt * 0.83;
      const hs = Math.max(1, w * 0.6);
      const head = set.head[HEAD_OF[f.c] === 1 ? (f.c === 2 ? 1 : 2) : 0];
      if (rounded && w > 3) {
        // Close enough to have shoulders, a round head and a soft shadow
        set.body[f.c].roundRect(b.x - w / 2, b.y - bodyH, w, bodyH, [w * 0.45, w * 0.45, w * 0.12, w * 0.12]);
        set.side.rect(b.x + w * 0.16, b.y - bodyH * 0.9, w * 0.34, bodyH * 0.9);
        head.moveTo(b.x + hs / 2, b.y - hgt + hs / 2);
        head.arc(b.x, b.y - hgt + hs / 2, hs / 2, 0, TAU);
        set.shade.moveTo(b.x + w * 1.1, b.y);
        set.shade.ellipse(b.x + w * 0.25, b.y, w * 0.85, w * 0.26, 0, 0, TAU);
      } else {
        set.body[f.c].rect(b.x - w / 2, b.y - bodyH, w, bodyH);
        head.rect(b.x - hs / 2, b.y - hgt, hs, hs);
        set.shade.rect(b.x - w * 0.15, b.y - w * 0.3, w * 1.5, w * 0.6);
      }
    }
    for (const key of ["back", "front"] as const) {
      const ctx = key === "back" ? back : front;
      const set = layers[key];
      ctx.fillStyle = "rgba(45,36,24,0.22)";
      ctx.fill(set.shade);
      set.body.forEach((path, i) => {
        ctx.fillStyle = BODY[i];
        ctx.fill(path);
      });
      ctx.fillStyle = "rgba(70,58,40,0.16)";
      ctx.fill(set.side);
      set.head.forEach((path, i) => {
        ctx.fillStyle = HEADS[i];
        ctx.fill(path);
      });
    }
    if (this.walker) this.drawWalker(back, front, c);
  }

  /**
   * The pilgrim you follow: a lantern-bright figure with a ring of light on
   * the marble, and the ground already covered traced behind them like a
   * long-exposure photograph.
   */
  private drawWalker(back: CanvasRenderingContext2D, front: CanvasRenderingContext2D, c: Camera) {
    const w = this.walker!;
    const at = (a: number, y = 0) => {
      const r = this.radiusAt(WALK_R, a);
      return project(c, Math.cos(a) * r, y, Math.sin(a) * r);
    };
    // Trail: the last circuit and a half, fading out behind the walker
    const span = Math.min(w.traveled, TAU * 1.5);
    const steps = Math.max(2, Math.ceil(span / 0.03));
    for (const L of ["back", "front"] as const) {
      const ctx = L === "back" ? back : front;
      ctx.save();
      ctx.lineCap = "round";
      let prev = at(START_ANGLE - w.traveled, 1.0);
      for (let i = 1; i <= steps; i++) {
        const a = START_ANGLE - w.traveled + (span * i) / steps;
        const p = at(a, 1.0);
        const layer = (p.d + prev.d) / 2 > this.kaabaDepth ? "back" : "front";
        if (layer === L) {
          const age = i / steps; // 0 at the walker, 1 at the oldest point
          ctx.strokeStyle = `rgba(255,208,120,${(0.75 * (1 - age)).toFixed(3)})`;
          ctx.lineWidth = Math.max(1.4, 0.2 * p.k);
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
        prev = p;
      }
      ctx.restore();
    }
    const a = START_ANGLE - w.traveled;
    const p = at(a);
    const ctx = p.d > this.kaabaDepth ? back : front;
    const hgt = 1.8 * p.k;
    // Ring of light on the floor
    const ring: P2[] = [];
    for (let i = 0; i <= 28; i++) {
      const t = (i / 28) * TAU;
      const r = this.radiusAt(WALK_R, a);
      ring.push(project(c, Math.cos(a) * r + Math.cos(t) * 1.6, 0.02, Math.sin(a) * r + Math.sin(t) * 1.6));
    }
    const pulse = 0.55 + Math.sin(this.t * 4) * 0.25;
    ctx.strokeStyle = `rgba(255,214,130,${pulse.toFixed(3)})`;
    ctx.lineWidth = 1.6;
    poly(ctx, ring);
    ctx.stroke();
    glow(ctx, p.x, p.y - hgt * 0.5, Math.max(22, 3.4 * p.k), "rgba(255,214,130,0.7)");
    // Beam of light above, so the walker is findable in the crowd
    const top = at(a, 9);
    const beam = ctx.createLinearGradient(0, top.y, 0, p.y - hgt);
    beam.addColorStop(0, "rgba(255,226,160,0)");
    beam.addColorStop(1, "rgba(255,226,160,0.55)");
    ctx.fillStyle = beam;
    const bw = Math.max(2, 0.28 * p.k);
    ctx.fillRect(p.x - bw / 2, top.y, bw, p.y - hgt - top.y);
    ctx.fillStyle = "#fff6dc";
    ctx.fillRect(p.x - 0.3 * p.k, p.y - hgt * 0.84, 0.6 * p.k, hgt * 0.84);
    ctx.fillStyle = "#f0c860";
    ctx.beginPath();
    ctx.arc(p.x, p.y - hgt, Math.max(1.8, 0.3 * p.k), 0, TAU);
    ctx.fill();
  }
}
