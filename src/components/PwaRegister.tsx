"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaRegister() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Gagal mendaftarkan service worker:", err);
      });
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  if (!installEvent) {
    return (
      <p className="pwa-hint">
        Pasang sebagai aplikasi: buka menu browser lalu pilih Tambah ke layar utama
        (iPhone/Safari) atau gunakan ikon install di address bar (Android/Chrome).
      </p>
    );
  }

  return (
    <button
      className="btn btn-ghost install-btn"
      onClick={async () => {
        await installEvent.prompt();
        await installEvent.userChoice;
        setInstallEvent(null);
      }}
    >
      Pasang Aplikasi
    </button>
  );
}
