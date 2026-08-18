import Hero from "@/components/Hero";
import UploadForm from "@/components/UploadForm";
import TrackBrowser from "@/components/TrackBrowser";
import PwaRegister from "@/components/PwaRegister";

export default function Home() {
  return (
    <>
      <Hero />

      <main>
        <div className="disclaimer">
          <b>Catatan keselamatan:</b> Data jalur di sini berasal dari unggahan
          komunitas dan bisa saja sudah berubah kondisinya. Selalu cek cuaca,
          izin pendakian, dan kondisi jalur terbaru sebelum berangkat.
        </div>

        <section className="panel" id="upload">
          <div className="panel-head">
            <h2>Unggah Jalur</h2>
          </div>
          <UploadForm />
        </section>

        <section className="panel" id="browse">
          <div className="panel-head">
            <h2>Jelajahi Jalur</h2>
            <span className="count">cari berdasarkan provinsi</span>
          </div>
          <TrackBrowser />
        </section>
      </main>

      <footer>
        <PwaRegister />
        JALUR — dibangun oleh komunitas, untuk komunitas. Selalu utamakan
        keselamatan di alam bebas.
      </footer>
    </>
  );
}
