"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(/assets/hero_bg.png)`,
          backgroundPosition: 'center',
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center pt-20">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 bg-[#39ff14]/10 border border-[#39ff14] text-[#39ff14] px-4 py-1.5 rounded-full font-bold tracking-widest text-xs md:text-sm uppercase box-glow-green"
        >
          <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></span>
          EN STOCK - LIVRAISON 58 WILAYAS
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="font-heading text-6xl sm:text-7xl md:text-9xl text-white leading-none mb-2 select-none uppercase"
        >
          HM.ZONE<span className="text-[#39ff14] text-glow-green">DZ</span>
        </motion.h1>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-heading text-3xl md:text-5xl text-[#ff00ff] tracking-wide mb-8 uppercase"
        >
          N°1 EN ALGÉRIE <span className="text-white opacity-50 mx-2">|</span> GROS & DÉTAIL
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-lg md:text-2xl text-[#a1a1aa] font-sans font-medium mb-12 max-w-2xl"
        >
          Goûts puissants. Style unique. Attention à la contrefaçon ❌. L'original est ici.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link 
            href="#shop"
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-[#39ff14] text-black font-heading text-xl px-8 py-4 uppercase hover:bg-white hover:text-black transition-all box-glow-green"
          >
            <ShoppingBag size={24} />
            Voir la Boutique
          </Link>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1.5, duration: 1 }}
           className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs font-bold tracking-widest uppercase">Découvrir</span>
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/2 bg-[#39ff14]"
              animate={{ y: [0, 48, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
