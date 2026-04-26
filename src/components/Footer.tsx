"use client";

import { Mail, MapPin, Phone, Car, Send } from "lucide-react";
import Link from "next/link";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 7.1C2.6 5.8 3.6 4.8 4.9 4.7 7.3 4.5 12 4.5 12 4.5s4.7 0 7.1.2c1.3.1 2.3 1.1 2.4 2.4.2 1.6.2 4.9.2 4.9s0 3.3-.2 4.9c-.1 1.3-1.1 2.3-2.4 2.4-2.4.2-7.1.2-7.1.2s-4.7 0-7.1-.2c-1.3-.1-2.3-1.1-2.4-2.4-.2-1.6-.2-4.9-.2-4.9s0-3.3.2-4.9z"/>
    <polygon points="10 15 15 12 10 9 10 15"/>
  </svg>
);
import { useState } from "react";

export function Footer() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    // Simulate sending
    setTimeout(() => {
      setFormStatus("sent");
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <footer id="contact" className="bg-[#050505] border-t border-white/5 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#ff0000]/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <div className="p-2 rounded-lg bg-[#111] border border-white/10 group-hover:border-[#ff0000] transition-all duration-300">
                <Car className="w-6 h-6 text-[#ff0000]" />
              </div>
              <span className="text-xl font-heading font-bold tracking-widest uppercase">
                BENZ AUTO <span className="text-[#ff0000]">DZ</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Votre destination n°1 en Algérie pour l'excellence automobile. Revues, conseils et véhicules premium sélectionnés pour vous.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass-dark border border-white/10 flex items-center justify-center hover:border-[#e1306c] hover:bg-[#e1306c]/10 text-white hover:text-[#e1306c] transition-all duration-300">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-dark border border-white/10 flex items-center justify-center hover:border-[#ff0000] hover:bg-[#ff0000]/10 text-white hover:text-[#ff0000] transition-all duration-300">
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide uppercase">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#ff0000] transition-colors text-sm flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-[#ff0000] before:rounded-full before:opacity-0 hover:before:opacity-100 before:transition-opacity">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#vlogs" className="text-gray-400 hover:text-[#ff0000] transition-colors text-sm flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-[#ff0000] before:rounded-full before:opacity-0 hover:before:opacity-100 before:transition-opacity">
                  Derniers Tests
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-gray-400 hover:text-[#ff0000] transition-colors text-sm flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-[#ff0000] before:rounded-full before:opacity-0 hover:before:opacity-100 before:transition-opacity">
                  Showroom Premium
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-[#ff0000] transition-colors text-sm flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-[#ff0000] before:rounded-full before:opacity-0 hover:before:opacity-100 before:transition-opacity">
                  Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide uppercase">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#ff0000] shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Alger, Algérie</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#ff0000] shrink-0" />
                <a href="tel:+213000000000" className="text-gray-400 hover:text-white transition-colors text-sm">+213 00 00 00 00</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#ff0000] shrink-0" />
                <a href="mailto:contact@benzautodz.com" className="text-gray-400 hover:text-white transition-colors text-sm">contact@benzautodz.com</a>
              </li>
            </ul>
          </div>

          {/* Quick Contact Form */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide uppercase">Demande Rapide</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input 
                  type="text" 
                  placeholder="Votre nom" 
                  required
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition-all"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email ou Téléphone" 
                  required
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition-all"
                />
              </div>
              <div>
                <textarea 
                  placeholder="Votre message (véhicule recherché, etc.)" 
                  rows={2}
                  required
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition-all resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={formStatus !== "idle"}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  formStatus === "idle" 
                    ? "bg-white text-black hover:bg-gray-200" 
                    : formStatus === "sending"
                    ? "bg-[#b026ff]/20 text-[#b026ff] border border-[#b026ff]/50"
                    : "bg-green-500/20 text-green-400 border border-green-500/50"
                }`}
              >
                {formStatus === "idle" && <><Send className="w-4 h-4" /> Envoyer</>}
                {formStatus === "sending" && "Envoi en cours..."}
                {formStatus === "sent" && "Message envoyé !"}
              </button>
            </form>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Benz Auto DZ. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Mentions légales</Link>
            <Link href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
