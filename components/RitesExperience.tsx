"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Stage, type Hints, type RiteId, type Scene, type SceneLabel, type WalkState } from "./rites/engine";
import { HalqScene } from "./rites/halq";
import { IhramScene } from "./rites/ihram";
import { SaiScene } from "./rites/sai";
import { TawafScene } from "./rites/tawaf";

/**
 * "Umrah in four steps", drawn: the miqat crossing on a night map of the
 * Hejaz, the tawaf around the Kaaba seen from above the Mataf, the sa'i down
 * the Mas'a gallery, and the completed rite. Visitors can walk the seven
 * circuits (or lengths) with the dua for each part, taken from lib/duas.ts.
 *
 * All the step text is server-rendered; the canvases are a layer on top that
 * pauses off-screen and shows one still frame for reduced-motion users.
 */

export type { RiteId };

export type RitesCopy = {
  steps: { id: RiteId; title: string; body: string }[];
  hints: Hints;
  talbiyah: { arabic: string; transliteration: string };
};

function makeScene(id: RiteId, hints: Hints, small: boolean): Scene {
  const density = small ? 0.8 : 1;
  switch (id) {
    case "ihram":
      return new IhramScene();
    case "tawaf":
      return new TawafScene(hints, density);
    case "sai":
      return new SaiScene(hints, density);
    case "halq":
      return new HalqScene();
  }
}

const labelCls: Record<string, string> = {
  base: "pointer-events-none absolute whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide backdrop-blur-sm transition-opacity duration-500 sm:text-[11px]",
  plain: "border-white/10 bg-night-950/75 text-sand-50",
  gold: "border-gold-400/40 bg-night-950/80 text-gold-200",
  green: "border-wa-400/40 bg-night-950/80 text-wa-400",
};

const anchorTransform: Record<NonNullable<SceneLabel["anchor"]>, string> = {
  left: "translate(calc(-100% - 10px), -50%)",
  right: "translate(10px, -50%)",
  center: "translate(-50%, -50%)",
  above: "translate(-50%, calc(-100% - 10px))",
  below: "translate(-50%, 10px)",
};

/** Where a leader line meets its label: the label edge nearest the point. */
function leaderEnd(l: SceneLabel) {
  const gap = 10;
  switch (l.anchor ?? "center") {
    case "left":
      return [l.x - gap, l.y];
    case "right":
      return [l.x + gap, l.y];
    case "above":
      return [l.x, l.y - gap];
    case "below":
      return [l.x, l.y + gap];
    default:
      return [l.x, l.y];
  }
}

export default function RitesExperience({ copy }: { copy: RitesCopy }) {
  const [mode, setMode] = useState<RiteId>("tawaf");
  const [walk, setWalk] = useState<WalkState | null>(null);
  const [flag, setFlag] = useState(false);
  const [labels, setLabels] = useState<SceneLabel[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const midRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const stage = useRef<Stage | null>(null);
  const small = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !bgRef.current || !backRef.current || !midRef.current || !frontRef.current) return;
    small.current = wrap.clientWidth < 520;
    const s = new Stage(
      { bg: bgRef.current, back: backRef.current, mid: midRef.current, front: frontRef.current },
      wrap,
      {
        reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        onLabels: setLabels,
        onWalk: setWalk,
        onFlag: setFlag,
      },
    );
    s.setScene(makeScene("tawaf", copy.hints, small.current), true);
    stage.current = s;
    return () => {
      s.destroy();
      stage.current = null;
    };
  }, [copy.hints]);

  // Keep every label inside the stage: on a phone a name near the edge would be clipped.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const box = wrap.getBoundingClientRect();
    const pad = 6;
    wrap.querySelectorAll<HTMLElement>("[data-scene-label]").forEach((el) => {
      el.style.marginLeft = "0px";
      const r = el.getBoundingClientRect();
      const left = r.left - box.left;
      const right = r.right - box.left;
      const shift = left < pad ? pad - left : right > box.width - pad ? box.width - pad - right : 0;
      if (shift) el.style.marginLeft = `${shift}px`;
    });
  }, [labels]);

  function select(id: RiteId) {
    if (id === mode) return;
    setMode(id);
    setWalk(null);
    setFlag(false);
    stage.current?.setScene(makeScene(id, copy.hints, small.current));
  }

  const walkable = mode === "tawaf" || mode === "sai";
  const unit = mode === "tawaf" ? "Circuit" : "Length";

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <div>
        <ol className="space-y-2.5">
          {copy.steps.map((s, i) => {
            const active = s.id === mode;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => select(s.id)}
                  aria-pressed={active}
                  className={`group w-full rounded-2xl border px-5 py-4 text-left transition duration-500 ${
                    active ? "border-gold-400/45 bg-white/[0.06] shadow-[0_24px_50px_-30px_rgb(0_0_0/0.8)]" : "border-white/10 hover:border-white/25 hover:bg-white/[0.03]"
                  }`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className={`figure text-[0.8rem] font-extrabold ${active ? "text-gold-300" : "text-sand-200/50"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`font-display text-[1.75rem] leading-tight transition ${active ? "text-sand-50" : "text-sand-100/70 group-hover:text-sand-50"}`}>{s.title}</span>
                  </span>
                  <span className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <span className="overflow-hidden">
                      <span className="block pb-1 pl-9 pt-2 text-[0.96rem] leading-relaxed text-sand-200/85">{s.body}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div
          className={`mt-5 overflow-hidden rounded-2xl border border-gold-400/25 bg-gradient-to-br from-gold-400/10 to-transparent transition-all duration-500 ${
            walkable ? "max-h-72 p-5 opacity-100" : "max-h-0 border-transparent p-0 opacity-0"
          }`}
          aria-hidden={!walkable}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-gold-300">
                {walk ? (walk.done ? `${unit === "Circuit" ? "Seven circuits" : "Seven lengths"} complete` : `${unit} ${walk.count} of 7`) : "Walk it yourself"}
              </p>
              <p className="mt-1.5 min-h-[2.6em] text-[0.93rem] leading-snug text-sand-100" aria-live="polite">
                {walk
                  ? walk.hint
                  : mode === "tawaf"
                    ? "Follow one pilgrim around the Kaaba, with the dua for each part of the circuit."
                    : "Follow one pilgrim from Safa to Marwah and back, seven lengths in all."}
              </p>
            </div>
            <button type="button" className="btn btn-gold shrink-0" onClick={() => stage.current?.startWalk()} tabIndex={walkable ? 0 : -1}>
              {walk && !walk.done ? "Start again" : mode === "tawaf" ? "Walk the tawaf" : "Walk the sa'i"}
            </button>
          </div>
          <div className="mt-4 flex gap-1.5" aria-hidden>
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                  walk && (walk.done || i < walk.count - 1) ? "bg-gold-300" : walk && i === walk.count - 1 ? "bg-gold-300/50" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="arch-frame mx-auto w-full max-w-[560px]">
        <div data-rites-stage className="arch relative aspect-[4/5] w-full bg-night-950 shadow-[0_60px_120px_-50px_rgb(0_0_0/0.95)]">
          <div ref={wrapRef} className="absolute inset-0 transition-opacity duration-[380ms]" aria-hidden>
            <canvas ref={bgRef} className="absolute inset-0 h-full w-full" />
            <canvas ref={backRef} className="absolute inset-0 h-full w-full" />
            <canvas ref={midRef} className="absolute inset-0 h-full w-full" />
            <canvas ref={frontRef} className="absolute inset-0 h-full w-full" />
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              {labels.map((l) => {
                if (l.px === undefined || l.py === undefined) return null;
                const [ex, ey] = leaderEnd(l);
                return (
                  <g key={`${mode}-${l.id}-leader`}>
                    {/* A dark underlay keeps the gold line legible on white marble and on night sky alike */}
                    <line x1={l.px} y1={l.py} x2={ex} y2={ey} stroke="rgb(6 18 15 / 0.55)" strokeWidth="3" strokeLinecap="round" />
                    <line x1={l.px} y1={l.py} x2={ex} y2={ey} stroke="#f0d596" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx={l.px} cy={l.py} r="6" fill="rgb(6 18 15 / 0.35)" stroke="#f0d596" strokeWidth="1" />
                    <circle cx={l.px} cy={l.py} r="2.2" fill="#f7e6bb" />
                  </g>
                );
              })}
            </svg>
            {labels.map((l) => (
              <span
                key={`${mode}-${l.id}`}
                data-scene-label
                className={`${labelCls.base} ${labelCls[l.tone ?? "plain"]}`}
                style={{ left: l.x, top: l.y, transform: anchorTransform[l.anchor ?? "center"] }}
              >
                {l.text}
              </span>
            ))}
            {mode === "ihram" && (
              <div
                className="absolute bottom-[7%] right-[5%] max-w-[62%] rounded-2xl border border-gold-400/35 bg-night-950/85 px-4 py-3 text-right backdrop-blur-md transition duration-700"
                style={{ opacity: flag ? 1 : 0, transform: flag ? "none" : "translateY(8px)" }}
              >
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-gold-300">Crossing the miqat</p>
                <p className="arabic mt-1 text-[1.2rem] leading-[1.7] text-gold-200 sm:text-[1.4rem]" lang="ar">
                  {copy.talbiyah.arabic}
                </p>
                <p className="text-[0.72rem] italic text-sand-200/85">{copy.talbiyah.transliteration}</p>
              </div>
            )}
            {mode === "halq" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="arabic text-[2rem] leading-[1.6] text-foil sm:text-[2.6rem]" lang="ar">
                  تَقَبَّلَ اللَّهُ
                </p>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.25em] text-sand-100/80">Umrah complete</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
