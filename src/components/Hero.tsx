import HeroStats from "./HeroStats";

export default function Hero() {
  return (
    <div className="hero">
      <svg
        className="contour-svg"
        viewBox="0 0 1200 520"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g fill="none" stroke="var(--paper)" strokeWidth="1">
          <path d="M-50,90 C150,40 300,140 500,80 C700,20 900,120 1250,60" opacity="0.10" />
          <path d="M-50,150 C180,90 330,200 520,150 C720,90 920,180 1250,120" opacity="0.14" />
          <path d="M-50,210 C200,150 350,250 540,210 C740,150 930,240 1250,190" opacity="0.16" />
          <path d="M-50,270 C220,210 360,300 560,270 C760,210 940,300 1250,260" opacity="0.14" />
          <path d="M-50,330 C230,280 370,360 570,340 C770,280 950,360 1250,330" opacity="0.12" />
          <path d="M-50,390 C230,350 380,420 580,400 C780,350 960,420 1250,400" opacity="0.09" />
          <path d="M-50,450 C230,420 390,470 580,460 C780,420 960,470 1250,460" opacity="0.06" />
        </g>
        <g
          stroke="var(--clay)"
          strokeWidth="1.6"
          fill="none"
          opacity="0.55"
          strokeDasharray="1 9"
          strokeLinecap="round"
        >
          <path d="M40,480 C260,420 340,300 460,260 C600,210 700,150 900,95 C1000,68 1080,50 1160,30" />
        </g>
        <g fill="var(--clay)" opacity="0.85">
          <circle cx="40" cy="480" r="4" />
          <circle cx="460" cy="260" r="4" />
          <circle cx="900" cy="95" r="4" />
          <circle cx="1160" cy="30" r="5" />
        </g>
      </svg>

      <div className="topbar">
        <div className="brand">
          <span className="dot" />JALUR
        </div>
        <HeroStats />
      </div>

      <div className="hero-inner">
        <div className="eyebrow">Basis data jejak GPX komunitas Indonesia</div>
        <h1>
          JANGAN
          <br />
          TERSESAT<span>.</span>
        </h1>
        <p className="tagline">
          Kumpulan jalur GPX untuk pendakian gunung, trail run, dan konservasi —
          diunggah dan dibagikan oleh sesama pejalan. Cari berdasarkan provinsi.
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#upload">
            Unggah Jalur GPX
          </a>
          <a className="btn btn-ghost" href="#browse">
            Jelajahi Jalur
          </a>
        </div>
      </div>
    </div>
  );
}
