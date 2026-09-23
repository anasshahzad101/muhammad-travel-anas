import { glow, rng, type Scene, type SceneLabel } from "./engine";
import { LAND_PATH, RAIL_PATH, projectLonLat } from "@/lib/geo-map";

/**
 * Ihram: the Hejaz at night, drawn from the real coastline (Natural Earth,
 * the same data as the journey map), as a night satellite sees it: city
 * lights, the highways between them as strings of sodium lamps, the Haramain
 * railway and the five miqat stations at their true
 * positions. A flight from Pakistan passes the miqat east of Makkah on its way
 * to Jeddah; the talbiyah appears as it does.
 *
 * Coordinates (degrees): Dhul Hulayfah 24.4137N 39.5424E; Al-Juhfah, used
 * today at Rabigh 22.7970N 39.0161E; Qarn al-Manazil (As-Sayl al-Kabir)
 * 21.6264N 40.4153E; Yalamlam 20.5179N 39.8702E; Dhat Irq 21.9300N 40.4255E.
 */

type LL = [number, number]; // [lon, lat]

const MIQATS: { id: string; name: string; ll: LL; anchor: SceneLabel["anchor"] }[] = [
  { id: "dh", name: "Dhul Hulayfah", ll: [39.5424, 24.4137], anchor: "right" },
  { id: "ju", name: "Al-Juhfah (Rabigh)", ll: [39.0161, 22.797], anchor: "left" },
  { id: "di", name: "Dhat Irq", ll: [40.4255, 21.93], anchor: "right" },
  { id: "qm", name: "Qarn al-Manazil", ll: [40.4153, 21.6264], anchor: "right" },
  { id: "ya", name: "Yalamlam", ll: [39.8702, 20.5179], anchor: "right" },
];

const CITY_LIGHTS: { ll: LL; r: number; n: number }[] = [
  { ll: [39.1728, 21.5433], r: 26, n: 260 }, // Jeddah
  { ll: [39.8262, 21.4225], r: 19, n: 190 }, // Makkah
  { ll: [39.6111, 24.4672], r: 18, n: 160 }, // Madinah
  { ll: [40.4158, 21.2703], r: 12, n: 80 }, // Taif
  { ll: [38.0618, 24.0895], r: 11, n: 70 }, // Yanbu
  { ll: [39.0349, 22.7986], r: 7, n: 34 }, // Rabigh
  { ll: [39.1, 22.3], r: 5, n: 20 }, // Thuwal
  { ll: [40.27, 20.15], r: 5, n: 18 }, // Al-Lith
  { ll: [38.79, 23.78], r: 5, n: 16 }, // Badr
];

// The main highways, which show from orbit at night as faint lines of light.
const ROADS: LL[][] = [
  [[39.17, 21.54], [39.5, 21.46], [39.83, 21.42]], // Jeddah to Makkah
  [[39.83, 21.42], [40.1, 21.36], [40.42, 21.27]], // Makkah to Taif
  [[39.17, 21.54], [39.1, 22.3], [39.03, 22.8], [38.83, 23.1], [38.4, 23.7], [38.06, 24.09]], // the coast north to Yanbu
  [[39.2, 21.7], [39.35, 22.4], [39.25, 23.1], [39.35, 23.8], [39.61, 24.47]], // the Hijrah road to Madinah
  [[39.17, 21.54], [39.35, 21.1], [39.7, 20.6], [40.27, 20.15]], // the coast south to Al-Lith
];

const JEDDAH_AIRPORT: LL = [39.1565, 21.6796];
const MAKKAH: LL = [39.8262, 21.4225];
const MADINAH: LL = [39.6111, 24.4672];

export class IhramScene implements Scene {
  id = "ihram" as const;
  fade = 0.05;
  private w = 0;
  private h = 0;
  private scale = 1;
  private ox = 0;
  private oy = 0;
  private planeT = 0.04;
  private crossAt = 0.6;
  private path: { x: number; y: number }[] = [];
  private entryIdx = 0;
  private land: Path2D | null = null;
  private rail: Path2D | null = null;

  private ll([lon, lat]: LL) {
    const [mx, my] = projectLonLat(lon, lat);
    return { x: this.ox + mx * this.scale, y: this.oy + my * this.scale };
  }

  layout(w: number, h: number): SceneLabel[] {
    this.w = w;
    this.h = h;
    // Frame the Hejaz from south of Yalamlam to north of Madinah.
    const corners: LL[] = [
      [37.9, 19.9],
      [41.9, 19.9],
      [37.9, 25.1],
      [41.9, 25.1],
    ];
    const pts = corners.map(([lon, lat]) => projectLonLat(lon, lat));
    const minX = Math.min(...pts.map((p) => p[0]));
    const maxX = Math.max(...pts.map((p) => p[0]));
    const minY = Math.min(...pts.map((p) => p[1]));
    const maxY = Math.max(...pts.map((p) => p[1]));
    this.scale = Math.min(w / (maxX - minX), h / (maxY - minY)) * 1.02;
    this.ox = w / 2 - ((minX + maxX) / 2) * this.scale;
    this.oy = h / 2 - ((minY + maxY) / 2) * this.scale;
    if (!this.land) {
      this.land = new Path2D(LAND_PATH);
      this.rail = new Path2D(RAIL_PATH);
    }

    const p0 = this.ll([43.6, 23.2]);
    const cp = this.ll([41.0, 22.35]);
    const p1 = this.ll(JEDDAH_AIRPORT);
    this.path = [];
    for (let i = 0; i <= 200; i++) {
      const s = i / 200;
      const u = 1 - s;
      this.path.push({ x: u * u * p0.x + 2 * u * s * cp.x + s * s * p1.x, y: u * u * p0.y + 2 * u * s * cp.y + s * s * p1.y });
    }
    const line = [MIQATS[2], MIQATS[3], MIQATS[4]].map((m) => this.ll(m.ll));
    const lineX = (y: number) => {
      for (let i = 0; i < line.length - 1; i++) {
        const a = line[i];
        const b = line[i + 1];
        if ((y - a.y) * (y - b.y) <= 0) return a.x + ((y - a.y) / (b.y - a.y || 1)) * (b.x - a.x);
      }
      return y < line[0].y ? line[0].x : line[line.length - 1].x;
    };
    const idx = this.path.findIndex((p) => p.x < lineX(p.y));
    this.crossAt = (idx < 0 ? 120 : idx) / 200;
    this.entryIdx = Math.max(0, this.path.findIndex((p) => p.x < w - 2));
    const entry = this.path[this.entryIdx] ?? this.path[40];

    const mk = this.ll(MAKKAH);
    const jd = this.ll(JEDDAH_AIRPORT);
    const md = this.ll(MADINAH);
    const sea = this.ll([38.3, 21.0]);
    return [
      ...MIQATS.map((m) => ({ id: m.id, text: m.name, ...this.ll(m.ll), anchor: m.anchor, tone: "gold" as const })),
      { id: "makkah", text: "Makkah", x: mk.x, y: mk.y + 4, anchor: "right" },
      { id: "jeddah", text: "Jeddah", x: jd.x, y: jd.y, anchor: "left" },
      { id: "madinah", text: "Madinah", x: md.x, y: md.y, anchor: "left" },
      { id: "sea", text: "Red Sea", x: sea.x, y: sea.y, anchor: "center" },
      { id: "from", text: "From Pakistan", x: w - 16, y: entry.y - 22, anchor: "left", tone: "gold" },
    ];
  }

  step(dt: number) {
    this.planeT = (this.planeT + dt / 12) % 1.2;
  }

  flag() {
    return this.planeT > this.crossAt && this.planeT < 1.16;
  }

  drawStatic(bg: CanvasRenderingContext2D, _mid: CanvasRenderingContext2D, W: number, Hh: number) {
    // The sea at night
    const sea = bg.createLinearGradient(0, 0, W, Hh);
    sea.addColorStop(0, "#04111d");
    sea.addColorStop(1, "#020a12");
    bg.fillStyle = sea;
    bg.fillRect(0, 0, W, Hh);
    // A faint shimmer on the water
    const sr = rng(3);
    bg.fillStyle = "rgba(120,170,210,0.06)";
    for (let i = 0; i < 400; i++) bg.fillRect(sr() * W, sr() * Hh, 1 + sr() * 5, 1);

    // Land: dark desert
    bg.save();
    bg.translate(this.ox, this.oy);
    bg.scale(this.scale, this.scale);
    const lg = bg.createLinearGradient(0, 0, 1000 / 1, 560);
    lg.addColorStop(0, "#1c1a13");
    lg.addColorStop(1, "#15150f");
    bg.fillStyle = lg;
    bg.fill(this.land!);
    bg.restore();

    // Texture the land in screen pixels, clipped to the coast.
    const base = bg.getTransform();
    bg.save();
    bg.translate(this.ox, this.oy);
    bg.scale(this.scale, this.scale);
    bg.clip(this.land!);
    bg.setTransform(base);
    const r = rng(5);
    for (let i = 0; i < 320; i++) {
      const x = r() * W;
      const y = r() * Hh;
      const rad = 18 + r() * 60;
      const g = bg.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, r() < 0.5 ? "rgba(90,74,48,0.14)" : "rgba(30,48,40,0.12)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      bg.fillStyle = g;
      bg.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    // Highways: dotted sodium lamps along smooth curves through each road's points
    const kk = Math.min(W, Hh) / 600;
    const lr = rng(12);
    for (const road of ROADS) {
      const pts = road.map((q) => this.ll(q));
      const curve = new Path2D();
      curve.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) curve.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
      curve.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      bg.strokeStyle = "rgba(255,176,90,0.07)";
      bg.lineWidth = 4 * kk;
      bg.stroke(curve);
      bg.strokeStyle = "rgba(255,190,110,0.32)";
      bg.lineWidth = 0.9;
      bg.setLineDash([1, 2.6 + lr() * 0.6]);
      bg.stroke(curve);
      bg.setLineDash([]);
    }
    bg.restore();

    // Coastline glow
    bg.save();
    bg.translate(this.ox, this.oy);
    bg.scale(this.scale, this.scale);
    bg.shadowColor = "rgba(212,171,90,0.6)";
    bg.shadowBlur = 12;
    bg.strokeStyle = "rgba(230,199,127,0.55)";
    bg.lineWidth = 1.2 / this.scale;
    bg.stroke(this.land!);
    bg.shadowBlur = 0;
    // Haramain railway: a thin solid line
    bg.strokeStyle = "rgba(245,240,230,0.5)";
    bg.lineWidth = 1.3 / this.scale;
    bg.stroke(this.rail!);
    bg.restore();

    // City lights
    const cr = rng(9);
    const k = Math.min(W, Hh) / 600;
    for (const city of CITY_LIGHTS) {
      const p = this.ll(city.ll);
      glow(bg, p.x, p.y, city.r * 2.6 * k, "rgba(255,190,100,0.32)");
      for (let i = 0; i < city.n; i++) {
        const a = cr() * Math.PI * 2;
        const d = Math.pow(cr(), 0.7) * city.r * k;
        bg.fillStyle = cr() < 0.25 ? "rgba(255,248,228,0.95)" : "rgba(255,186,95,0.75)";
        bg.fillRect(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d * 0.8, cr() < 0.2 ? 1.6 : 1, 1);
      }
    }
    const mk = this.ll(MAKKAH);
    glow(bg, mk.x, mk.y, 38 * k, "rgba(255,240,205,0.9)");
    glow(bg, mk.x, mk.y, 10 * k, "rgba(255,255,255,1)");

    // The miqat line that flights from the east cross, and the five stations
    const line = [MIQATS[2], MIQATS[3], MIQATS[4]].map((m) => this.ll(m.ll));
    const ext = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    const pts = [ext(line[1], line[0], 2.2), ...line, ext(line[1], line[2], 1.3)];
    bg.strokeStyle = "rgba(230,199,127,0.85)";
    bg.lineWidth = 1.8;
    bg.setLineDash([7, 5]);
    bg.beginPath();
    pts.forEach((p, i) => (i ? bg.lineTo(p.x, p.y) : bg.moveTo(p.x, p.y)));
    bg.stroke();
    bg.setLineDash([]);
    for (const m of MIQATS) {
      const p = this.ll(m.ll);
      glow(bg, p.x, p.y, 18, "rgba(230,199,127,0.5)");
      bg.strokeStyle = "#e6c77f";
      bg.lineWidth = 1.5;
      bg.beginPath();
      bg.arc(p.x, p.y, 6, 0, Math.PI * 2);
      bg.stroke();
      bg.fillStyle = "#f3dca4";
      bg.beginPath();
      bg.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      bg.fill();
    }
    // The planned route on to Jeddah, faint
    bg.strokeStyle = "rgba(255,248,232,0.28)";
    bg.lineWidth = 1.2;
    bg.setLineDash([2, 6]);
    bg.beginPath();
    this.path.slice(this.entryIdx).forEach((p, i) => (i ? bg.lineTo(p.x, p.y) : bg.moveTo(p.x, p.y)));
    bg.stroke();
    bg.setLineDash([]);
    // Vignette
    const v = bg.createRadialGradient(W / 2, Hh / 2, Math.min(W, Hh) * 0.35, W / 2, Hh / 2, Math.max(W, Hh) * 0.75);
    v.addColorStop(0, "rgba(2,8,10,0)");
    v.addColorStop(1, "rgba(2,8,10,0.7)");
    bg.fillStyle = v;
    bg.fillRect(0, 0, W, Hh);
  }

  drawDynamic(_back: CanvasRenderingContext2D, front: CanvasRenderingContext2D) {
    if (this.planeT >= 1) return;
    const i = Math.min(199, Math.floor(this.planeT * 200));
    const f = this.planeT * 200 - i;
    const a = this.path[i];
    const b = this.path[i + 1];
    const x = a.x + (b.x - a.x) * f;
    const y = a.y + (b.y - a.y) * f;
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    // The route flown so far, in gold (the slow fade keeps it glowing)
    if (i > this.entryIdx) {
      front.strokeStyle = "rgba(240,205,130,0.09)";
      front.lineWidth = 2;
      front.beginPath();
      for (let j = this.entryIdx; j <= i; j++) (j === this.entryIdx ? front.moveTo(this.path[j].x, this.path[j].y) : front.lineTo(this.path[j].x, this.path[j].y));
      front.lineTo(x, y);
      front.stroke();
    }
    // Contrail: the slow fade leaves a long glowing wake
    front.fillStyle = "rgba(255,244,220,0.85)";
    front.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
    glow(front, x, y, 18, "rgba(255,240,210,0.3)");
    front.save();
    front.translate(x, y);
    front.rotate(ang);
    const s = Math.max(1, Math.min(this.w, this.h) / 600) * 1.25;
    front.scale(s, s);
    front.fillStyle = "#fffaf0";
    front.beginPath();
    front.moveTo(9, 0);
    front.lineTo(-2, -1.4);
    front.lineTo(-5, -8);
    front.lineTo(-7, -8);
    front.lineTo(-5, -1.4);
    front.lineTo(-8, -1.2);
    front.lineTo(-9.5, -3.6);
    front.lineTo(-10.6, -3.6);
    front.lineTo(-9.6, 0);
    front.lineTo(-10.6, 3.6);
    front.lineTo(-9.5, 3.6);
    front.lineTo(-8, 1.2);
    front.lineTo(-5, 1.4);
    front.lineTo(-7, 8);
    front.lineTo(-5, 8);
    front.lineTo(-2, 1.4);
    front.closePath();
    front.fill();
    if (Math.floor(performance.now() / 500) % 2 === 0) {
      front.fillStyle = "#ff4d4d";
      front.fillRect(-6.4, -8.6, 1.8, 1.8);
      front.fillStyle = "#4dff88";
      front.fillRect(-6.4, 6.8, 1.8, 1.8);
    }
    front.restore();
  }
}
