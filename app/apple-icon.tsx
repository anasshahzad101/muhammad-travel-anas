import { ImageResponse } from "next/og";

/** Home-screen icon for iPhone users who save the site (common for WhatsApp-shared links). */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <svg width="120" height="120" viewBox="0 0 40 40">
          <rect x="9" y="9" width="22" height="22" fill="none" stroke="#d4ab5a" strokeWidth="2" />
          <rect x="9" y="9" width="22" height="22" fill="none" stroke="#d4ab5a" strokeWidth="2" transform="rotate(45 20 20)" />
          <circle cx="20" cy="20" r="3.6" fill="#d4ab5a" />
        </svg>
      </div>
    ),
    size,
  );
}
