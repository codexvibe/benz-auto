"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Boutique', href: '/shop' },
    { name: 'Promotions', href: '#promos' },
    { name: 'Gros & Détail', href: '#gros' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex flex-col">
      <div 
        className="bg-[#ef4444] text-white flex whitespace-nowrap relative font-bold text-xs md:text-sm tracking-widest h-[32px] overflow-hidden border-b border-black w-full"
      >
        <div className="animate-marquee h-full flex items-center shrink-0 w-max">
          {/* Bloc de texte 1 */}
          <div className="flex items-center shrink-0">
            <span className="mx-4">🔥 LIVRAISON RAPIDE 58 WILAYAS 🇩🇿</span>
            <span className="mx-4">|</span>
            <span className="mx-4">CONTREFAÇON ❌</span>
            <span className="mx-4">|</span>
            <span className="mx-4">COMMANDE VIA WHATSAPP 📲</span>
            <span className="mx-4">|</span>
            <span className="mx-4">🔥 LIVRAISON RAPIDE 58 WILAYAS 🇩🇿</span>
            <span className="mx-4">|</span>
            <span className="mx-4">CONTREFAÇON ❌</span>
            <span className="mx-4">|</span>
            <span className="mx-4">COMMANDE VIA WHATSAPP 📲</span>
            <span className="mx-4">|</span>
          </div>
          {/* Bloc de texte 2 Identique pour la boucle fluide */}
          <div className="flex items-center shrink-0">
            <span className="mx-4">🔥 LIVRAISON RAPIDE 58 WILAYAS 🇩🇿</span>
            <span className="mx-4">|</span>
            <span className="mx-4">CONTREFAÇON ❌</span>
            <span className="mx-4">|</span>
            <span className="mx-4">COMMANDE VIA WHATSAPP 📲</span>
            <span className="mx-4">|</span>
            <span className="mx-4">🔥 LIVRAISON RAPIDE 58 WILAYAS 🇩🇿</span>
            <span className="mx-4">|</span>
            <span className="mx-4">CONTREFAÇON ❌</span>
            <span className="mx-4">|</span>
            <span className="mx-4">COMMANDE VIA WHATSAPP 📲</span>
            <span className="mx-4">|</span>
          </div>
        </div>
      </div>

      <header 
        className={`w-full transition-all duration-300 ${
          isScrolled ? 'glass-dark py-3' : 'bg-gradient-to-b from-black/80 to-transparent py-4 md:py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/assets/logo.png" 
              alt="HM.ZONEDZ Logo" 
              width="50" 
              height="50" 
              className="rounded-md object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] md:text-xs text-[#39ff14] font-bold tracking-widest uppercase">N°1 EN ALGÉRIE</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="font-heading text-lg text-white hover:text-[#39ff14] transition-colors uppercase tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/213000000000"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 bg-black border border-[#39ff14] text-[#39ff14] px-4 py-2 rounded-sm font-heading hover:bg-[#39ff14] hover:text-black transition-all box-glow-green-hover"
            >
              <MessageCircle size={18} />
              <span>WhatsApp</span>
            </a>
            
            <button className="relative p-2 text-white hover:text-[#39ff14] transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute top-0 right-0 bg-[#ef4444] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col pt-20 px-6 pb-6"
          >
            <button 
              className="absolute top-6 right-6 text-white p-2 rounded-full border border-white/20 hover:text-[#39ff14] hover:border-[#39ff14]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>

            <nav className="flex flex-col gap-6 mt-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="font-heading text-4xl text-white hover:text-[#39ff14] uppercase tracking-wide border-b border-white/10 pb-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-10">
              <a 
                href="https://wa.me/213000000000"
                target="_blank"
                rel="noreferrer"
                className="flex justify-center items-center gap-3 bg-[#39ff14] text-black px-6 py-4 rounded-sm font-heading text-2xl w-full"
              >
                <MessageCircle size={24} />
                COMMANDER SUR WHATSAPP
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
