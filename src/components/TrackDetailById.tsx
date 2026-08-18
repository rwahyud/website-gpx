"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TrackDetail from "./TrackDetail";

export default function TrackDetailById() {
  const params = useSearchParams();
  const id = params.get("id");

  if (!id) {
    return (
      <div className="empty">
        <div className="display">Jalur tidak ditemukan</div>
        Tautan ini tidak lengkap. Pilih jalur dari daftar di halaman utama.
        <div className="detail-actions">
          <Link className="btn btn-primary" href="/">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return <TrackDetail id={id} />;
}
