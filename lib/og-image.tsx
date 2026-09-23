/**
 * Renders a share card (lib/og.ts) to an image. Server-only: imported by
 * app/og/[...slug]/route.tsx, which prerenders every card at build time.
 *
 * Design: the page's photo on the right, fading into night green on the left
 * where the text sits; a thin gold frame and a faint eight-point-star lattice;
 * the brand mark and wordmark top left; the title in Cormorant Garamond; the
 * price (or a subtitle) in Manrope.
 *
 * Fonts are static TTF instances (Satori cannot read woff2 or variable fonts)
 * in assets/fonts/, under the SIL Open Font License (licence files alongside).
 *
 * Output is JPEG. WhatsApp tends to drop link-preview images above roughly
 * 300 KB, and a photographic PNG at 1200x630 is several times that. Next's
 * ImageResponse only emits PNG, so the PNG is re-encoded with sharp, which is
 * installed with Next (it is Next's own image-optimisation dependency). If
 * sharp is missing the PNG is served as-is and a warning is logged.
 */

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { ImageResponse } from "next/og";
import { images, type ImageKey } from "./images";
import { LOGO, SHARE_CARD_SIZE, shareCardBasisLine, shareCardPriceLine, plainDashes, type ShareCard } from "./og";
import { season } from "./season";
import { site } from "./site";

const W = SHARE_CARD_SIZE.width;
const H = SHARE_CARD_SIZE.height;
/** The photo fills the right of the card; the text column sits on solid night green. */
const PHOTO_W = 780;

const C = {
  night: "#06120e",
  nightRgb: "6, 18, 14",
  markFill: "#0f2721",
  frame: "rgba(201, 160, 82, 0.45)",
  gold: "#d9b46a",
  price: "#e6c77f",
  ivory: "#fbf7ef",
  ivory80: "rgba(251, 247, 239, 0.8)",
  ivory70: "rgba(251, 247, 239, 0.7)",
};

/**
 * Where the crop centres on each photo (imgix focal point, 0-1), so the subject
 * lands in the visible right-hand part of the card. Unlisted photos crop centred.
 */
const FOCUS: Partial<Record<ImageKey, { x: number; y: number }>> = {
  kaabaTowers: { x: 0.5, y: 0.6 },
  clockTower: { x: 0.5, y: 0.42 },
  nabawiPortrait: { x: 0.5, y: 0.55 },
  nabawiDome: { x: 0.62, y: 0.5 },
  nabawiWide: { x: 0.62, y: 0.5 },
  minaretPalm: { x: 0.55, y: 0.45 },
};

type Font = { name: string; data: Buffer; weight: 500 | 600 | 700; style: "normal" };

let fonts: Promise<Font[]> | undefined;

function loadFonts(): Promise<Font[]> {
  const dir = path.join(process.cwd(), "assets", "fonts");
  const font = async (file: string, name: string, weight: Font["weight"]): Promise<Font> => ({
    name,
    data: await readFile(path.join(dir, file)),
    weight,
    style: "normal",
  });
  fonts ??= Promise.all([
    font("CormorantGaramond-SemiBold.ttf", "Cormorant Garamond", 600),
    font("Manrope-Medium.ttf", "Manrope", 500),
    font("Manrope-Bold.ttf", "Manrope", 700),
  ]);
  return fonts;
}

const photos = new Map<ImageKey, Promise<string | null>>();

/**
 * The photo as a data URL, cropped by Unsplash's CDN to exactly the size drawn.
 * A failed download renders the card without a photo rather than failing the
 * build.
 */
function loadPhoto(key: ImageKey): Promise<string | null> {
  let p = photos.get(key);
  if (!p) {
    const focus = FOCUS[key];
    const params = new URLSearchParams({
      fm: "jpg",
      q: "85",
      w: String(PHOTO_W),
      h: String(H),
      fit: "crop",
      ...(focus ? { crop: "focalpoint", "fp-x": String(focus.x), "fp-y": String(focus.y) } : {}),
    });
    const url = `${images[key].src}?${params.toString()}`;
    p = (async () => {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = Buffer.from(await res.arrayBuffer());
          return `data:image/jpeg;base64,${data.toString("base64")}`;
        } catch (err) {
          if (attempt === 3) {
            console.warn(`[og] Could not download photo "${key}" (${url}); rendering the card without it.`, err);
          }
        }
      }
      return null;
    })();
    photos.set(key, p);
  }
  return p;
}

type Sharp = (input: Buffer) => {
  jpeg(options: { quality: number; mozjpeg?: boolean; chromaSubsampling?: string }): { toBuffer(): Promise<Buffer> };
};

let sharp: Promise<Sharp | null> | undefined;

/** sharp, resolved at runtime from the project (never bundled), or null if it isn't installed. */
function loadSharp(): Promise<Sharp | null> {
  sharp ??= (async () => {
    try {
      return createRequire(path.join(process.cwd(), "package.json"))("sharp") as Sharp;
    } catch {
      console.warn("[og] sharp is not installed: share cards are served as PNG, which may be too large for WhatsApp previews.");
      return null;
    }
  })();
  return sharp;
}

/** Title size steps down with length so every title fits in three lines. */
function titleSize(title: string): number {
  const n = title.length;
  if (n <= 22) return 78;
  if (n <= 32) return 74;
  if (n <= 44) return 68;
  return 64;
}

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <linearGradient id="mk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dca4" />
          <stop offset="0.5" stopColor={C.gold} />
          <stop offset="1" stopColor="#a8782c" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="28" height="28" rx="2.5" fill={C.markFill} />
      <rect x="6" y="6" width="28" height="28" rx="2.5" fill={C.markFill} transform="rotate(45 20 20)" />
      <g fill="none" stroke="url(#mk)" strokeWidth="1.3">
        <rect x="11" y="11" width="18" height="18" rx="1.2" />
        <rect x="11" y="11" width="18" height="18" rx="1.2" transform="rotate(45 20 20)" />
        <circle cx="20" cy="20" r="5.6" />
      </g>
      <circle cx="20" cy="20" r="2.6" fill="url(#mk)" />
    </svg>
  );
}

/** Faint eight-point-star lattice over the text side, fading out before the photo. */
function Lattice() {
  const s = 84;
  const h = s / 2;
  const q = 17;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", top: 0, left: 0 }}>
      <defs>
        <pattern id="lattice" width={s} height={s} patternUnits="userSpaceOnUse">
          <g fill="none" stroke={C.gold} strokeWidth="1">
            <rect x={h - q} y={h - q} width={q * 2} height={q * 2} />
            <rect x={h - q} y={h - q} width={q * 2} height={q * 2} transform={`rotate(45 ${h} ${h})`} />
            <path d={`M${h} 0V${h - q - 7}M${h} ${s}V${h + q + 7}M0 ${h}H${h - q - 7}M${s} ${h}H${h + q + 7}`} />
          </g>
        </pattern>
        <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="fade-mask">
          <rect width={W} height={H} fill="url(#fade)" />
        </mask>
      </defs>
      <rect width={W} height={H} fill="url(#lattice)" opacity="0.085" mask="url(#fade-mask)" />
    </svg>
  );
}

function Card({ card, photo }: { card: ShareCard; photo: string | null }) {
  const price = shareCardPriceLine(card);
  const basis = shareCardBasisLine(card);
  const size = titleSize(card.title);
  const footer = card.price ? `Prices checked ${season.pricesChecked} · ${basis}` : card.id === "site" ? null : plainDashes(site.tagline);
  const shade = (a: number) => `rgba(${C.nightRgb}, ${a})`;
  // Keeps the ends of long lines legible where they run over a bright photo.
  const glow = `0 2px 16px ${shade(0.7)}`;

  return (
    <div style={{ width: W, height: H, display: "flex", position: "relative", background: C.night, fontFamily: "Manrope" }}>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" width={PHOTO_W} height={H} style={{ position: "absolute", top: 0, right: 0, width: PHOTO_W, height: H }} />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          display: "flex",
          // Opaque where the photo begins (35%), so its edge never shows as a seam.
          backgroundImage: `linear-gradient(90deg, ${shade(1)} 0%, ${shade(1)} 35%, ${shade(0.9)} 50%, ${shade(0.62)} 68%, ${shade(0.34)} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          display: "flex",
          backgroundImage: `linear-gradient(0deg, ${shade(0.55)} 0%, ${shade(0)} 38%)`,
        }}
      />
      <Lattice />
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          width: W - 56,
          height: H - 56,
          display: "flex",
          border: `1px solid ${C.frame}`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          padding: "66px 76px 62px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Mark size={58} />
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 16 }}>
            <div style={{ fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 34, lineHeight: 1, color: C.ivory }}>
              {site.name}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 3.75, color: C.gold, marginTop: 9 }}>
              {`UMRAH · ${site.contact.address.city.toUpperCase()}`}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 700 }}>
          <div
            style={{
              fontFamily: "Cormorant Garamond",
              fontWeight: 600,
              fontSize: size,
              lineHeight: 1.05,
              letterSpacing: -0.5,
              color: C.ivory,
              textShadow: glow,
            }}
          >
            {card.title}
          </div>
          {price ? (
            <div style={{ display: "flex", flexDirection: "column", marginTop: 28, textShadow: glow }}>
              <div style={{ fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.price }}>{price}</div>
              <div style={{ fontWeight: 500, fontSize: 22, color: C.ivory80, marginTop: 12 }}>Visa · Flights · Hotels · Transport</div>
            </div>
          ) : card.subtitle ? (
            <div style={{ fontWeight: 500, fontSize: 28, lineHeight: 1.25, color: C.price, marginTop: 24, textShadow: glow }}>
              {card.subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", fontWeight: 500, fontSize: 18, color: C.ivory70 }}>{footer ?? ""}</div>
      </div>
    </div>
  );
}

/**
 * The square logo: the brand mark on night green. The mark stays inside the
 * central 80% circle, so the same file also works as a maskable app icon.
 */
export function renderLogo(): Response {
  const s = LOGO.size;
  return new ImageResponse(
    (
      <div style={{ width: s, height: s, display: "flex", alignItems: "center", justifyContent: "center", background: C.night }}>
        <Mark size={Math.round(s * 0.7)} />
      </div>
    ),
    { width: s, height: s },
  );
}

/** Renders the card as a JPEG (PNG if sharp is unavailable). */
export async function renderShareCard(card: ShareCard): Promise<Response> {
  const [fontList, photo] = await Promise.all([loadFonts(), loadPhoto(card.image)]);
  const png = Buffer.from(await new ImageResponse(<Card card={card} photo={photo} />, { ...SHARE_CARD_SIZE, fonts: fontList }).arrayBuffer());
  const encoder = await loadSharp();
  const jpeg = encoder ? await encoder(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer() : null;
  const body = jpeg ?? png;
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": jpeg ? "image/jpeg" : "image/png",
      "Cache-Control":
        process.env.NODE_ENV === "development" ? "no-store" : "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
