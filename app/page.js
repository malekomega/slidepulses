"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    // Redirect to the static landing page
    window.location.replace("/landing.html");
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060810",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: "3px solid #1a1d2e",
        borderTopColor: "#6366F1",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
