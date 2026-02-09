"use client";

import { Suspense } from "react";
import SlidePulseEditor from "../../components/SlidePulseEditor";

export default function EditorPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#060810" }} />}>
      <SlidePulseEditor />
    </Suspense>
  );
}