"use client";

import { useEffect, useState } from "react";
import type { Track } from "@/lib/types";
import { subscribeTracks } from "@/lib/tracks";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function HeroStats() {
  const configured = isFirebaseConfigured();
  const [tracks, setTracks] = useState<Track[] | null>(null);

  useEffect(() => {
    if (!configured) return;
    const unsub = subscribeTracks((list) => setTracks(list));
    return () => unsub();
  }, [configured]);

  if (configured && tracks === null) {
    return (
      <div className="topstats">
        <span className="mono">MEMUAT…</span>
      </div>
    );
  }

  const list = tracks ?? [];
  const totalKm = list.reduce((s, t) => s + (t.distanceKm || 0), 0);
  return (
    <div className="topstats">
      <span className="mono">{list.length} JALUR</span>
      <span className="mono">{Math.round(totalKm)} KM</span>
    </div>
  );
}
