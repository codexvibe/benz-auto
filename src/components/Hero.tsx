"use client";

import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* LCP-optimized background image using next/image */}
      <Image
        src="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop"
        alt="Luxury car background"
        fill
        priority
        sizes="100vw"
        className="object-cover grayscale opacity-30 mix-blend-luminosity"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/60 to-background z-10" />

      {/* Noise texture — inlined SVG data URI, no external request */}
      <div
        className="absolute inset-0 opacity-10 z-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center justify-center mt-12">
        <div className="inline-block mb-6 px-5 py-1.5 rounded-full border border-white/10 bg-white/2 backdrop-blur-md animate-fade-in">
          <span className="text-slate-300 text-[10px] font-bold tracking-[0.3em] uppercase">
            L&apos;Élégance Automobile en Algérie
          </span>
        </div>

        <h1
          className="text-5xl md:text-8xl lg:text-9xl font-heading font-black text-white mb-6 leading-[0.9] tracking-tighter animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          LUXE <br />
          <span className="text-transparent bg-clip-text bg-linear-to-b from-white via-brand-red to-brand-red-dark">
            ABSOLU
          </span>
        </h1>

        <p
          className="max-w-2xl text-lg md:text-xl text-slate-400 mb-12 font-light tracking-wide animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          Confiez-nous la réalisation d&apos;une vidéo premium pour vendre votre véhicule au meilleur prix.
          Découvrez également notre sélection de voitures de luxe en vente.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <Link
            href="/cars"
            className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-brand-red hover:text-white hover:scale-105 transition-all duration-500 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(230,0,0,0.2)]"
          >
            Véhicules en Vente
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-50 hover:opacity-100 transition-opacity duration-500 cursor-pointer">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-slate-400">Découvrir</span>
        <div className="w-px h-16 bg-linear-to-b from-brand-red to-transparent animate-pulse" />
      </div>
    </section>
  );
}
