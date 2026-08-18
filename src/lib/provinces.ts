export interface Province {
  id: string;
  name: string;
  region: string;
}

export const PROVINCES: Province[] = [
  { id: "aceh", name: "Aceh", region: "Sumatera" },
  { id: "sumatera-utara", name: "Sumatera Utara", region: "Sumatera" },
  { id: "sumatera-barat", name: "Sumatera Barat", region: "Sumatera" },
  { id: "riau", name: "Riau", region: "Sumatera" },
  { id: "jambi", name: "Jambi", region: "Sumatera" },
  { id: "sumatera-selatan", name: "Sumatera Selatan", region: "Sumatera" },
  { id: "bengkulu", name: "Bengkulu", region: "Sumatera" },
  { id: "lampung", name: "Lampung", region: "Sumatera" },
  { id: "kep-bangka-belitung", name: "Kepulauan Bangka Belitung", region: "Sumatera" },
  { id: "kep-riau", name: "Kepulauan Riau", region: "Sumatera" },
  { id: "dki-jakarta", name: "DKI Jakarta", region: "Jawa" },
  { id: "jawa-barat", name: "Jawa Barat", region: "Jawa" },
  { id: "banten", name: "Banten", region: "Jawa" },
  { id: "jawa-tengah", name: "Jawa Tengah", region: "Jawa" },
  { id: "di-yogyakarta", name: "DI Yogyakarta", region: "Jawa" },
  { id: "jawa-timur", name: "Jawa Timur", region: "Jawa" },
  { id: "bali", name: "Bali", region: "Bali & Nusa Tenggara" },
  { id: "ntb", name: "Nusa Tenggara Barat", region: "Bali & Nusa Tenggara" },
  { id: "ntt", name: "Nusa Tenggara Timur", region: "Bali & Nusa Tenggara" },
  { id: "kalimantan-barat", name: "Kalimantan Barat", region: "Kalimantan" },
  { id: "kalimantan-tengah", name: "Kalimantan Tengah", region: "Kalimantan" },
  { id: "kalimantan-selatan", name: "Kalimantan Selatan", region: "Kalimantan" },
  { id: "kalimantan-timur", name: "Kalimantan Timur", region: "Kalimantan" },
  { id: "kalimantan-utara", name: "Kalimantan Utara", region: "Kalimantan" },
  { id: "sulawesi-utara", name: "Sulawesi Utara", region: "Sulawesi" },
  { id: "sulawesi-tengah", name: "Sulawesi Tengah", region: "Sulawesi" },
  { id: "sulawesi-selatan", name: "Sulawesi Selatan", region: "Sulawesi" },
  { id: "sulawesi-tenggara", name: "Sulawesi Tenggara", region: "Sulawesi" },
  { id: "gorontalo", name: "Gorontalo", region: "Sulawesi" },
  { id: "sulawesi-barat", name: "Sulawesi Barat", region: "Sulawesi" },
  { id: "maluku", name: "Maluku", region: "Maluku" },
  { id: "maluku-utara", name: "Maluku Utara", region: "Maluku" },
  { id: "papua-barat", name: "Papua Barat", region: "Papua" },
  { id: "papua-barat-daya", name: "Papua Barat Daya", region: "Papua" },
  { id: "papua-tengah", name: "Papua Tengah", region: "Papua" },
  { id: "papua-pegunungan", name: "Papua Pegunungan", region: "Papua" },
  { id: "papua-selatan", name: "Papua Selatan", region: "Papua" },
  { id: "papua", name: "Papua", region: "Papua" },
];

export const PROVINCE_NAMES: string[] = PROVINCES.map((p) => p.name);

export function provinceName(id: string): string {
  return PROVINCES.find((p) => p.id === id)?.name ?? id;
}

const PALETTE = [
  "#52694A", "#B5502E", "#2F6E62", "#3E5C76", "#A6763C", "#6B4E71", "#7A3B3B",
  "#8A9A5B", "#C77E43", "#3F7D8C", "#7A5C8E", "#B5545C", "#5C6B8A", "#9B8B4E",
  "#467A6A", "#B0693C", "#4E6E3C", "#875C94", "#C25E38", "#3E7480", "#6A5C47",
  "#8C9C4E", "#B54E68", "#4E8A7A", "#A8702C", "#5E708C", "#7A4E8C", "#C08A4E",
  "#3C8A6C", "#8C6A3C", "#4E5C94", "#A85C7A", "#6C8A3C", "#3C6E8C", "#B08C5C",
  "#5C8A3E", "#8C3E5C", "#3E8C9C",
];

export function colorForProvince(name: string): string {
  const i = PROVINCE_NAMES.indexOf(name);
  if (i === -1) return "#52694A";
  return PALETTE[i % PALETTE.length];
}
