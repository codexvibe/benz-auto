"use client";

import Link from "next/link";
import { Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video Placeholder (using a dark div with a subtle gradient for now) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#050505] z-10"></div>
        {/* Replace this div with an actual video tag in production */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop")' }}
        ></div>
        
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-10 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center">
        <div className="inline-block mb-4 px-4 py-1 rounded-full border border-[#ff0000]/30 bg-[#ff0000]/5 backdrop-blur-sm animate-fade-in">
          <span className="text-[#ff0000] text-xs font-semibold tracking-widest uppercase">
            N°1 en Algérie
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6 leading-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
          L'EXCELLENCE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0000] via-white to-[#ff0000]">
            AUTOMOBILE
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-gray-300 mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Découvrez nos revues exclusives, visitez virtuellement les meilleurs showrooms et trouvez le véhicule de vos rêves avec Benz Auto DZ.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link
            href="#showroom"
            className="px-8 py-4 bg-[#ff0000] text-white font-bold rounded-lg hover:bg-[#cc0000] transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Voir les véhicules
          </Link>
          <Link
            href="#vlogs"
            className="px-8 py-4 glass-dark text-white border border-[#ff0000]/50 rounded-lg hover:bg-[#ff0000]/10 hover:border-[#ff0000] hover:box-glow-red transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Play className="w-5 h-5 group-hover:text-[#ff0000] transition-colors" />
            Derniers Tests
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-float flex flex-col items-center opacity-70">
        <span className="text-xs uppercase tracking-widest mb-2 text-gray-400">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
      </div>
    </section>
  );
}
