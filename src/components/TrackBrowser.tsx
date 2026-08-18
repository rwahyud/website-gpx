"use client";

import { useEffect, useMemo, useState } from "react";
import type { Track } from "@/lib/types";
import { subscribeTracks } from "@/lib/tracks";
import { isFirebaseConfigured } from "@/lib/firebase";
import { PROVINCE_NAMES } from "@/lib/provinces";
import TrackCard from "./TrackCard";

export default function TrackBrowser() {
  const configured = isFirebaseConfigured();
  const [tracks, setTracks] = useState<Track[] | null>(null);
  const [province, setProvince] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!configured) return;
    const unsub = subscribeTracks((list) => {
      setTracks(list);
    });
    return () => unsub();
  }, [configured]);

  const filtered = useMemo(() => {
    if (!tracks) return [];
    const q = search.trim().toLowerCase();
    return tracks.filter((t) => {
      if (province && t.province !== province) return false;
      if (q) {
        const haystack = `${t.title} ${t.location} ${t.uploader}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [tracks, province, search]);

  return (
    <div>
      <div className="filters">
        <select
          className="province-select"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          aria-label="Filter provinsi"
        >
          <option value="">Semua Provinsi</option>
          {PROVINCE_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <div className="search-box">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari lokasi, gunung, atau nama…"
            aria-label="Cari jalur"
          />
        </div>
      </div>

      <div className="grid" id="trackGrid">
        {!configured ? (
          <div className="empty">
            <div className="display">Firebase belum dikonfigurasi</div>
            Salin <code>.env.local.example</code> menjadi <code>.env.local</code> dan
            isi kredensial dari Firebase Console. Lihat README untuk langkah lengkap.
          </div>
        ) : tracks === null ? (
          <div className="empty">
            <div className="display">Memuat…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="display">Belum ada jalur</div>
            {province
              ? `Belum ada jalur untuk provinsi ${province}. Jadilah yang pertama mengunggah.`
              : "Jadilah yang pertama mengunggah jalur."}
          </div>
        ) : (
          filtered.map((t) => <TrackCard key={t.id} track={t} />)
        )}
      </div>
    </div>
  );
}
