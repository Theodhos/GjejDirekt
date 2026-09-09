"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown by the root layout itself, where
 * app/error.tsx cannot render. It has to supply its own <html>/<body>, so it
 * deliberately avoids the shared layout and inlines its styling.
 */
export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="sq">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px"
        }}
      >
        <div style={{ maxWidth: "440px", textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", margin: "0 0 12px" }}>
            Diçka shkoi keq
          </h1>
          <p style={{ color: "#64748b", lineHeight: 1.6, margin: "0 0 24px" }}>
            Ndodhi një gabim i papritur. Provo sërish pas pak.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#E11D2E",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Provo sërish
          </button>
        </div>
      </body>
    </html>
  );
}
