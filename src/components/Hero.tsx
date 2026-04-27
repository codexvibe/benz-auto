"use client";

import Link from "next/link";
import { Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen min-h-175 flex items-center justify-center overflow-hidden">
      {/* Background  */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/60 to-background z-10"></div>
        {/* Grayscale video background effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity grayscale"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop")' }}
        ></div>
        
        {/* Subtle noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-10 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center justify-center mt-12">
        <div className="inline-block mb-6 px-5 py-1.5 rounded-full border border-white/10 bg-white/2 backdrop-blur-md animate-fade-in">
          <span className="text-slate-300 text-[10px] font-bold tracking-[0.3em] uppercase">
            L'Élégance Automobile en Algérie
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl lg:text-9xl font-heading font-black text-white mb-6 leading-[0.9] tracking-tighter animate-slide-up" style={{ animationDelay: "0.2s" }}>
          LUXE <br />
          <span className="text-transparent bg-clip-text bg-linear-to-b from-white via-slate-200 to-slate-500">
            ABSOLU
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-12 font-light tracking-wide animate-slide-up" style={{ animationDelay: "0.4s" }}>
          Confiez-nous la réalisation d'une vidéo premium pour vendre votre véhicule au meilleur prix. Découvrez également notre sélection de voitures de luxe en vente.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <Link
            href="/cars"
            className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-slate-200 hover:scale-105 transition-all duration-500 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Véhicules en Vente
          </Link>
          <Link
            href="#vlogs"
            className="px-10 py-5 glass-panel text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/50 hover:box-glow-chrome transition-all duration-500 flex items-center justify-center gap-3 group uppercase tracking-widest text-sm font-bold"
          >
            <Play className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
            Voir les Reels
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-50 hover:opacity-100 transition-opacity duration-500 cursor-pointer">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-slate-400">Découvrir</span>
        <div className="w-px h-16 bg-linear-to-b from-white/50 to-transparent animate-pulse-slow"></div>
      </div>
    </section>
  );
}
