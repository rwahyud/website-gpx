import type { Metadata } from "next";
import { Suspense } from "react";
import TrackDetailById from "@/components/TrackDetailById";

export const metadata: Metadata = {
  title: "Detail Jalur — JALUR",
};

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="empty">
          <div className="display">Memuat…</div>
        </div>
      }
    >
      <TrackDetailById />
    </Suspense>
  );
}
