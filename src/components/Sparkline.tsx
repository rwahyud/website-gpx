interface SparklineProps {
  profile: number[];
}

export function buildSparklinePath(profile: number[], w: number, h: number) {
  if (!profile || profile.length < 2) return { path: "", area: "" };
  const min = Math.min(...profile);
  const max = Math.max(...profile);
  const range = max - min || 1;
  const stepX = w / (profile.length - 1);
  const pts = profile.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return [x, y] as const;
  });
  const path = pts
    .map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1))
    .join(" ");
  const area = path + ` L${w},${h} L0,${h} Z`;
  return { path, area };
}

export default function Sparkline({ profile }: SparklineProps) {
  if (!profile || profile.length < 2) return null;
  const { path, area } = buildSparklinePath(profile, 280, 52);
  return (
    <svg
      className="sparkline"
      viewBox="0 0 280 52"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={area} fill="var(--paper-dim)"></path>
      <path d={path} fill="none" stroke="var(--clay)" strokeWidth="2"></path>
    </svg>
  );
}
