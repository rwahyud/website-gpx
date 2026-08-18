"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Track } from "@/lib/types";
import { getTrack, downloadTrack } from "@/lib/tracks";
import { isFirebaseConfigured } from "@/lib/firebase";
import { fmtKm, fmtM, fmtRelative } from "@/lib/gpx";
import { colorForProvince } from "@/lib/provinces";
import Sparkline from "./Sparkline";

interface TrackDetailProps {
  id: string;
}

export default function TrackDetail({ id }: TrackDetailProps) {
  const configured = isFirebaseConfigured();
  const [track, setTrack] = useState<Track | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [dlMsg, setDlMsg] = useState("");

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    getTrack(id)
      .then((t) => {
        if (cancelled) return;
        setTrack(t);
        setStatus(t ? "ready" : "error");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id, configured]);

  if (!configured) {
    return (
      <div className="empty">
        <div className="display">Firebase belum dikonfigurasi</div>
        Salin <code>.env.local.example</code> menjadi <code>.env.local</code> dan isi
        kredensial dari Firebase Console.
        <div className="detail-actions">
          <Link className="btn btn-primary" href="/">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return <div className="empty"><div className="display">Memuat…</div></div>;
  }

  if (status === "error" || !track) {
    return (
      <div className="empty">
        <div className="display">Jalur tidak ditemukan</div>
        Jalur ini tidak ada atau telah dihapus.
        <div className="detail-actions">
          <Link className="btn btn-primary" href="/">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const color = colorForProvince(track.province);

  return (
    <div className="detail">
      <Link className="back-link" href="/">
        ← Kembali ke daftar jalur
      </Link>

      <div className="detail-head">
        <span className="badge" style={{ background: color }}>
          {track.province}
        </span>
        <h1>{track.title}</h1>
        <div className="loc">{track.location || "—"}</div>
        <div className="detail-uploader">
          Diunggah oleh {track.uploader || "Anonim"}
          {track.createdAt ? ` · ${fmtRelative(track.createdAt)}` : ""}
        </div>
      </div>

      <Sparkline profile={track.profile} />

      <div className="detail-stats">
        <div className="stat">
          <span>Jarak</span>
          <b>{fmtKm(track.distanceKm || 0)}</b>
        </div>
        <div className="stat">
          <span>Elevasi naik</span>
          <b>{fmtM(track.gainM || 0)}</b>
        </div>
        <div className="stat">
          <span>Ketinggian maks</span>
          <b>{track.maxEle != null ? fmtM(track.maxEle) : "–"}</b>
        </div>
        <div className="stat">
          <span>Ketinggian min</span>
          <b>{track.minEle != null ? fmtM(track.minEle) : "–"}</b>
        </div>
        <div className="stat">
          <span>Titik jalur</span>
          <b>{track.pointCount}</b>
        </div>
      </div>

      {track.description && (
        <div className="detail-desc">
          <h2>Deskripsi</h2>
          <p>{track.description}</p>
        </div>
      )}

      <div className="detail-actions">
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await downloadTrack(track);
              setDlMsg("Berhasil diunduh.");
            } catch (err) {
              setDlMsg(
                "Gagal mengunduh: " +
                  (err instanceof Error ? err.message : "kesalahan")
              );
            }
          }}
        >
          Unduh .gpx
        </button>
        {dlMsg && <span className="detail-msg">{dlMsg}</span>}
      </div>
    </div>
  );
}
