import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { LatestVideos } from "../components/LatestVideos";
import { PremiumShowroom } from "../components/PremiumShowroom";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <LatestVideos />
        <PremiumShowroom />
      </main>
      <Footer />
    </>
  );
}

