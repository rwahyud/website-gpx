import Link from "next/link";
import type { Track } from "@/lib/types";
import { fmtKm, fmtM, fmtRelative } from "@/lib/gpx";
import { colorForProvince } from "@/lib/provinces";
import Sparkline from "./Sparkline";

interface TrackCardProps {
  track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
  const color = colorForProvince(track.province);
  return (
    <div className="card">
      <div className="card-top">
        <span className="badge" style={{ background: color }}>
          {track.province || "Provinsi"}
        </span>
        <h3>{track.title}</h3>
        <div className="loc">{track.location || "—"}</div>
      </div>
      <Sparkline profile={track.profile} />
      <div className="card-stats">
        <div>
          Jarak<b>{fmtKm(track.distanceKm || 0)}</b>
        </div>
        <div>
          Elevasi naik<b>{fmtM(track.gainM || 0)}</b>
        </div>
        <div>
          Maks<b>{track.maxEle != null ? fmtM(track.maxEle) : "–"}</b>
        </div>
      </div>
      {track.description ? (
        <div className="card-desc">
          <details>
            <summary>Deskripsi</summary>
            <p>{track.description}</p>
          </details>
        </div>
      ) : (
        <div className="card-desc" />
      )}
      <div className="card-foot">
        <span className="uploader">
          ↑ {track.uploader || "Anonim"}
          {track.createdAt ? ` · ${fmtRelative(track.createdAt)}` : ""}
        </span>
        <Link
          className="dl-btn"
          href={`/track?id=${encodeURIComponent(track.id)}`}
        >
          Lihat
        </Link>
      </div>
    </div>
  );
}
