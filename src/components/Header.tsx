"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Car } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Véhicules en Vente", href: "/cars" },
    { name: "Derniers Reels", href: "#vlogs" },
    { name: "Contact & Vente", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-700 ${
        isScrolled ? "glass-dark py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 group-hover:box-glow-chrome transition-all duration-500">
              <Car className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span className="text-xl font-heading font-bold tracking-widest uppercase">
              BENZ AUTO <span className="text-slate-400 font-light">DZ</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-500 relative group uppercase tracking-widest"
              >
                {link.name}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-white transition-all duration-500 group-hover:w-full group-hover:box-glow-chrome"></span>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/cars"
              className="px-8 py-3 rounded-full border border-white/20 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white/50 transition-all duration-500 box-glow-chrome-hover"
            >
              Découvrir
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden absolute top-full left-0 w-full glass-dark transition-all duration-500 overflow-hidden ${
          mobileMenuOpen ? "max-h-80 border-b border-white/10 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col py-6 px-6 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-slate-400 hover:text-white text-lg font-medium tracking-widest uppercase transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
