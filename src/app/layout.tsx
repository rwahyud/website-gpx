import type { Metadata, Viewport } from "next";
import {
  Big_Shoulders,
  Source_Serif_4,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "JALUR — Berbagi Jejak GPX",
  description:
    "Kumpulan jalur GPX untuk pendakian gunung, trail run, dan konservasi di Indonesia — diunggah dan dibagikan oleh komunitas.",
  applicationName: "JALUR",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: ["/icons/favicon-64.png", "/icons/icon-192.png", "/icons/icon-512.png"],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JALUR",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#182619",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
