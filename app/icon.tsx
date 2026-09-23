import { ImageResponse } from "next/og";

/** Favicon: the eight-point star mark in gold on haram green. */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b3a32",
          borderRadius: 14,
        }}
      >
        <svg width="46" height="46" viewBox="0 0 40 40">
          <rect x="9" y="9" width="22" height="22" fill="none" stroke="#d4ab5a" strokeWidth="2.4" />
          <rect x="9" y="9" width="22" height="22" fill="none" stroke="#d4ab5a" strokeWidth="2.4" transform="rotate(45 20 20)" />
          <circle cx="20" cy="20" r="4" fill="#d4ab5a" />
        </svg>
      </div>
    ),
    size,
  );
}
