export interface Track {
  id: string;
  title: string;
  province: string;
  location: string;
  description: string;
  uploader: string;
  filename: string;
  distanceKm: number;
  gainM: number;
  maxEle: number | null;
  minEle: number | null;
  pointCount: number;
  profile: number[];
  gpxData?: Uint8Array | null;
  createdAt: number;
}
