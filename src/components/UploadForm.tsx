"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { parseGPX, fmtKm, fmtM, type ParsedGpx } from "@/lib/gpx";
import { uploadTrack } from "@/lib/tracks";
import { isFirebaseConfigured } from "@/lib/firebase";
import { PROVINCE_NAMES } from "@/lib/provinces";

type Status = { text: string; kind: "err" | "ok" | "" };

export default function UploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<ParsedGpx | null>(null);
  const [rawGpx, setRawGpx] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [province, setProvince] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [uploader, setUploader] = useState("");
  const [status, setStatus] = useState<Status>({ text: "", kind: "" });
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".gpx")) {
      setParsed(null);
      setRawGpx(null);
      setFileName("");
      setStatus({ text: "Mohon pilih file dengan ekstensi .gpx", kind: "err" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target?.result ?? "");
        const stats = parseGPX(text);
        setRawGpx(text);
        setParsed(stats);
        setFileName(file.name);
        setStatus({ text: "", kind: "" });
      } catch (err) {
        setParsed(null);
        setRawGpx(null);
        setFileName("");
        setStatus({
          text: err instanceof Error ? err.message : "File tidak dapat dibaca",
          kind: "err",
        });
      }
    };
    reader.readAsText(file);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  async function onSubmit() {
    if (!isFirebaseConfigured()) {
      setStatus({
        text: "Firebase belum dikonfigurasi. Ikuti langkah di README.",
        kind: "err",
      });
      return;
    }
    if (!rawGpx || !parsed) {
      setStatus({ text: "Pilih file .gpx yang valid terlebih dahulu.", kind: "err" });
      return;
    }
    if (!title.trim()) {
      setStatus({ text: "Nama jalur wajib diisi.", kind: "err" });
      return;
    }
    if (!province) {
      setStatus({ text: "Pilih provinsi jalur.", kind: "err" });
      return;
    }

    setSubmitting(true);
    setStatus({ text: "Mengunggah…", kind: "" });
    try {
      await uploadTrack(
        {
          title: title.trim(),
          province,
          location: location.trim(),
          description: description.trim(),
          uploader: uploader.trim() || "Anonim",
          filename: fileName,
          distanceKm: parsed.distanceKm,
          gainM: parsed.gainM,
          maxEle: parsed.maxEle,
          minEle: parsed.minEle,
          pointCount: parsed.pointCount,
          profile: parsed.profile,
        },
        rawGpx
      );
      setStatus({ text: "Berhasil diunggah. Terima kasih!", kind: "ok" });
      resetForm();
    } catch (err) {
      setStatus({
        text:
          "Gagal mengunggah: " +
          (err instanceof Error ? err.message : "terjadi kesalahan"),
        kind: "err",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setTitle("");
    setProvince("");
    setLocation("");
    setDescription("");
    setUploader("");
    setFileName("");
    setParsed(null);
    setRawGpx(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="upload-card">
      <div
        className={"filedrop" + (dragging ? " drag" : "")}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <div className="mono drop-title">Klik atau seret file .gpx ke sini</div>
        <div className="fname">{fileName || "Belum ada file dipilih"}</div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".gpx"
          onChange={onSelectFile}
          hidden
        />
      </div>

      {parsed && (
        <div className="preview-stats">
          <span>
            Jarak <b>{fmtKm(parsed.distanceKm)}</b>
          </span>
          <span>
            Elevasi naik <b>{fmtM(parsed.gainM)}</b>
          </span>
          <span>
            Ketinggian maks <b>{parsed.maxEle != null ? fmtM(parsed.maxEle) : "–"}</b>
          </span>
          <span>
            Titik <b>{parsed.pointCount}</b>
          </span>
        </div>
      )}

      <div className="upload-grid">
        <div className="field full">
          <label htmlFor="fTitle">Nama Jalur / Event</label>
          <input
            id="fTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="cth: Jalur Pendakian Gunung Prau via Patak Banteng"
          />
        </div>
        <div className="field">
          <label htmlFor="fProvince">Provinsi</label>
          <select
            id="fProvince"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          >
            <option value="">— Pilih provinsi —</option>
            {PROVINCE_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="fLocation">Lokasi / Gunung</label>
          <input
            id="fLocation"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="cth: Gunung Prau, Dieng"
          />
        </div>
        <div className="field full">
          <label htmlFor="fDesc">Deskripsi</label>
          <textarea
            id="fDesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Info titik air, jalur alternatif, tingkat kesulitan, tahun event, dsb."
          />
        </div>
        <div className="field">
          <label htmlFor="fUploader">Nama Pengunggah</label>
          <input
            id="fUploader"
            type="text"
            value={uploader}
            onChange={(e) => setUploader(e.target.value)}
            placeholder="cth: Komunitas Trail Jogja"
          />
        </div>
      </div>

      <div className="upload-actions">
        <button
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? "Mengunggah…" : "Unggah"}
        </button>
        <span className={"upload-msg" + (status.kind ? " " + status.kind : "")}>
          {status.text}
        </span>
      </div>
    </div>
  );
}
