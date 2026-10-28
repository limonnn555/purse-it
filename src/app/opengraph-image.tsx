import { ImageResponse } from "next/og";

export const alt = "Purse It: your bag, designed around what you carry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#fafaf9",
          color: "#1c1917",
        }}
      >
        <div style={{ fontSize: 34, color: "#2563eb", fontWeight: 600, letterSpacing: 2 }}>
          PURSE IT
        </div>
        <div style={{ fontSize: 78, fontWeight: 700, lineHeight: 1.1, marginTop: 24, maxWidth: 980 }}>
          Your bag, designed around what you carry.
        </div>
        <div style={{ fontSize: 34, color: "#78716c", marginTop: 32 }}>
          Pick your items. Get a place for each one. Free to try.
        </div>
      </div>
    ),
    { ...size }
  );
}
