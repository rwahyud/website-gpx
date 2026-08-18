import { deflateSync, inflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");
mkdirSync(OUT_DIR, { recursive: true });

const COLORS = {
  bg: [0x18, 0x26, 0x19],
  trail: [0xb5, 0x50, 0x2e],
  dot: [0xf1, 0xea, 0xd6],
};

const TRAIL = [
  [0.14, 0.86],
  [0.34, 0.66],
  [0.5, 0.82],
  [0.68, 0.42],
  [0.86, 0.14],
];

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  const png = Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
  const back = inflateSync(idat);
  if (back.length !== raw.length) throw new Error("self-check failed: IDAT mismatch");
  return png;
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function render(size, { maskable }) {
  const rgba = Buffer.alloc(size * size * 4);
  const fill = (x, y, [r, g, b], a = 255) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    rgba[i] = r;
    rgba[i + 1] = g;
    rgba[i + 2] = b;
    rgba[i + 3] = a;
  };

  const corner = Math.round(size * 0.22);
  const scale = maskable ? 0.62 : 1;
  const off = maskable ? (1 - 0.62) / 2 : 0;
  const map = (v) => (off + v * scale) * size;

  const pts = TRAIL.map(([x, y]) => [map(x), map(y)]);
  const strokeW = size * 0.075 * scale;
  const dotR = size * 0.085 * scale;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let inside = true;
      if (!maskable) {
        const cx = Math.max(corner, Math.min(size - corner, x));
        const cy = Math.max(corner, Math.min(size - corner, y));
        inside = Math.hypot(x - cx, y - cy) <= corner;
      }
      if (!inside) continue;
      fill(x, y, COLORS.bg);

      let drawn = false;
      for (let i = 0; i < pts.length - 1 && !drawn; i++) {
        if (distToSegment(x + 0.5, y + 0.5, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]) <= strokeW / 2) {
          fill(x, y, COLORS.trail);
          drawn = true;
        }
      }
      if (drawn) continue;

      for (const [px, py] of [pts[0], pts[pts.length - 1]]) {
        if (Math.hypot(x + 0.5 - px, y + 0.5 - py) <= dotR) {
          fill(x, y, COLORS.dot);
          break;
        }
      }
    }
  }

  return encodePNG(size, size, rgba);
}

const targets = [
  { file: "favicon-64.png", size: 64, maskable: false },
  { file: "icon-192.png", size: 192, maskable: false },
  { file: "icon-512.png", size: 512, maskable: false },
  { file: "icon-maskable-192.png", size: 192, maskable: true },
  { file: "icon-maskable-512.png", size: 512, maskable: true },
  { file: "apple-touch-icon.png", size: 180, maskable: true },
];

for (const t of targets) {
  const png = render(t.size, { maskable: t.maskable });
  const out = join(OUT_DIR, t.file);
  writeFileSync(out, png);
  console.log(`wrote ${t.file} (${png.length} bytes)`);
}
