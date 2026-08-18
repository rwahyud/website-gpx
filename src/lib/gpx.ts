export interface ParsedGpx {
  distanceKm: number;
  gainM: number;
  maxEle: number | null;
  minEle: number | null;
  pointCount: number;
  profile: number[];
}

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function parseGPX(text: string): ParsedGpx {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("File GPX tidak valid");
  }

  let nodes = Array.from(doc.getElementsByTagName("trkpt"));
  if (nodes.length === 0) nodes = Array.from(doc.getElementsByTagName("rtept"));
  if (nodes.length === 0) {
    throw new Error("Tidak ditemukan titik jalur (trkpt) dalam file");
  }

  const points = nodes
    .map((n) => {
      const eleNode = n.getElementsByTagName("ele")[0];
      return {
        lat: parseFloat(n.getAttribute("lat") ?? ""),
        lon: parseFloat(n.getAttribute("lon") ?? ""),
        ele: eleNode ? parseFloat(eleNode.textContent ?? "") : null,
      };
    })
    .filter((p) => !isNaN(p.lat) && !isNaN(p.lon));

  if (points.length < 2) {
    throw new Error("File GPX harus berisi minimal 2 titik jalur");
  }

  let distanceKm = 0;
  for (let i = 1; i < points.length; i++) {
    distanceKm += haversineKm(
      points[i - 1].lat,
      points[i - 1].lon,
      points[i].lat,
      points[i].lon
    );
  }

  const elevations = points
    .map((p) => p.ele)
    .filter((e): e is number => e !== null && !isNaN(e));

  let gainM = 0;
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1];
    if (diff > 0.5) gainM += diff;
  }

  const maxEle = elevations.length ? Math.max(...elevations) : null;
  const minEle = elevations.length ? Math.min(...elevations) : null;

  const sampleCount = Math.min(40, elevations.length);
  const profile: number[] = [];
  if (elevations.length > 0) {
    const step = elevations.length / sampleCount;
    for (let i = 0; i < sampleCount; i++) {
      profile.push(elevations[Math.floor(i * step)]);
    }
  }

  return { distanceKm, gainM, maxEle, minEle, pointCount: points.length, profile };
}

export function fmtKm(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function fmtM(m: number): string {
  return `${Math.round(m)} m`;
}

export function fmtRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "baru saja";
  if (min < 60) return `${min} mnt lalu`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} hari lalu`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} bln lalu`;
  return `${Math.floor(mo / 12)} thn lalu`;
}

export const MAX_GPX_BYTES = 900_000;

export async function compressGpx(text: string): Promise<Uint8Array> {
  if (typeof CompressionStream === "undefined") {
    throw new Error(
      "Browser ini tidak mendukung kompresi. Gunakan Chrome/Edge/Safari terbaru."
    );
  }
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

export async function decompressGpx(data: Uint8Array): Promise<string> {
  const copy = data.slice();
  const stream = new Blob([copy.buffer as ArrayBuffer])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  return new Response(stream).text();
}
