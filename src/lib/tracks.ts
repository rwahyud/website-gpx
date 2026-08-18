import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  addDoc,
  getDoc,
  setDoc,
  Bytes,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "./firebase";
import { compressGpx, decompressGpx, MAX_GPX_BYTES } from "./gpx";
import type { Track } from "./types";

const COLLECTION = "tracks";
const FILE_DOC = "gpx";

function toTrack(id: string, data: Record<string, unknown>): Track {
  return {
    id,
    title: (data.title as string) ?? "",
    province: (data.province as string) ?? "",
    location: (data.location as string) ?? "",
    description: (data.description as string) ?? "",
    uploader: (data.uploader as string) ?? "Anonim",
    filename: (data.filename as string) ?? "",
    distanceKm: Number(data.distanceKm) || 0,
    gainM: Number(data.gainM) || 0,
    maxEle: data.maxEle != null ? Number(data.maxEle) : null,
    minEle: data.minEle != null ? Number(data.minEle) : null,
    pointCount: Number(data.pointCount) || 0,
    profile: Array.isArray(data.profile) ? data.profile.map(Number) : [],
    createdAt: Number(data.createdAt) || 0,
  };
}

export function subscribeTracks(cb: (tracks: Track[]) => void): Unsubscribe {
  const q = query(
    collection(getDb(), COLLECTION),
    orderBy("createdAt", "desc"),
    limit(200)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Track[] = [];
      snapshot.forEach((d) => {
        list.push(toTrack(d.id, d.data() as Record<string, unknown>));
      });
      cb(list);
    },
    (err) => {
      console.error("Gagal memuat jalur:", err);
      cb([]);
    }
  );
}

export async function uploadTrack(
  input: Omit<Track, "id" | "createdAt" | "gpxData">,
  rawGpx: string
): Promise<string> {
  const compressed = await compressGpx(rawGpx);
  if (compressed.length > MAX_GPX_BYTES) {
    throw new Error(
      "File GPX terlalu besar (lebih dari ±5 MB setelah dikompresi). Mohon pilih jalur dengan file lebih kecil."
    );
  }

  const db = getDb();
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: Date.now(),
  });
  try {
    await setDoc(
      doc(db, COLLECTION, ref.id, "file", FILE_DOC),
      { data: Bytes.fromUint8Array(compressed) },
      { merge: true }
    );
  } catch (err) {
    console.error("Gagal menyimpan file GPX, membatalkan upload:", err);
    throw new Error("Gagal menyimpan file GPX. Silakan coba lagi.");
  }
  return ref.id;
}

export async function getTrack(id: string): Promise<Track | null> {
  const snap = await getDoc(doc(getDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  return toTrack(snap.id, snap.data() as Record<string, unknown>);
}

async function getTrackBytes(id: string): Promise<Uint8Array> {
  const snap = await getDoc(doc(getDb(), COLLECTION, id, "file", FILE_DOC));
  if (!snap.exists()) throw new Error("File GPX tidak ditemukan");
  const data = snap.data() as Record<string, unknown>;
  if (!(data.data instanceof Bytes)) throw new Error("File GPX rusak");
  return data.data.toUint8Array();
}

export async function downloadTrack(track: Track): Promise<void> {
  const bytes = await getTrackBytes(track.id);
  const text = await decompressGpx(bytes);
  const blob = new Blob([text], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const name = (track.filename || `${track.title}.gpx`).replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
