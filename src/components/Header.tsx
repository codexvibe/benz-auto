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
    { name: "Véhicules", href: "/cars" },
    { name: "Revues & Vlogs", href: "#vlogs" },
    { name: "Contact", href: "#contact" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-dark py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-[#111] border border-white/10 group-hover:border-[#ff0000] group-hover:box-glow-red transition-all duration-300">
              <Car className="w-6 h-6 text-[#ff0000]" />
            </div>
            <span className="text-xl font-heading font-bold tracking-widest uppercase">
              BENZ AUTO <span className="text-[#ff0000]">DZ</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#ff0000] to-white transition-all duration-300 group-hover:w-full group-hover:box-glow-red"></span>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/cars"
              className="px-6 py-2 rounded-full border border-[#ff0000]/30 text-white font-medium hover:bg-[#ff0000]/10 hover:border-[#ff0000] transition-all duration-300 box-glow-red-hover"
            >
              Découvrir
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#ff0000]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden absolute top-full left-0 w-full glass-dark transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-64 border-b border-[#b026ff]/30" : "max-h-0"
        }`}
      >
        <div className="flex flex-col py-4 px-6 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-[#00f3ff] transition-colors"
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
