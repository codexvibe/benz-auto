"use client";

import { Mail, MapPin, Phone, Car, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
    <footer id="contact" className="bg-background border-t border-white/5 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="p-2.5 rounded-xl bg-surface border border-white/10 group-hover:border-white/30 transition-all duration-500 group-hover:box-glow-chrome">
                <Car className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-xl font-heading font-bold tracking-widest uppercase text-white">
                BENZ AUTO <span className="text-slate-400 font-light">DZ</span>
              </span>
            </Link>
            <p className="text-slate-400 mb-10 text-sm leading-relaxed font-light">
              L'excellence de la vente automobile. Nous réalisons des vidéos professionnelles de votre véhicule pour le vendre au meilleur prix, et nous vous proposons une sélection exclusive de voitures de luxe.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/5 text-white transition-all duration-500 group hover:box-glow-chrome">
                <InstagramIcon className="w-5 h-5 group-hover:text-[#e1306c] transition-colors duration-500" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/5 text-white transition-all duration-500 group hover:box-glow-chrome">
                <YoutubeIcon className="w-5 h-5 group-hover:text-[#ff0000] transition-colors duration-500" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-8 text-xs tracking-[0.2em] uppercase">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white transition-colors"></span>
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#vlogs" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white transition-colors"></span>
                  Derniers Reels
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white transition-colors"></span>
                  Véhicules en Vente
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-8 text-xs tracking-[0.2em] uppercase">Contact & Achat</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-slate-400 text-sm mt-1">Alger, Algérie</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <a href="tel:+213000000000" className="text-slate-400 hover:text-white transition-colors text-sm">+213 00 00 00 00</a>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <a href="mailto:contact@benzautodz.com" className="text-slate-400 hover:text-white transition-colors text-sm">contact@benzautodz.com</a>
              </li>
            </ul>
          </div>

          {/* Quick Contact Form */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-8 text-xs tracking-[0.2em] uppercase">Vendre votre voiture</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Votre nom" 
                  required
                  className="w-full bg-surface border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-slate-600"
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  placeholder="Téléphone" 
                  required
                  className="w-full bg-surface border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-slate-600"
                />
              </div>
              <div>
                <textarea 
                  placeholder="Modèle de la voiture à vendre..." 
                  rows={2}
                  required
                  className="w-full bg-surface border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all resize-none placeholder:text-slate-600"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={formStatus !== "idle"}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                  formStatus === "idle" 
                    ? "bg-white text-black hover:bg-slate-200 hover:box-glow-chrome" 
                    : formStatus === "sending"
                    ? "bg-white/10 text-white border border-white/20"
                    : "bg-green-500/20 text-green-400 border border-green-500/50"
                }`}
              >
                {formStatus === "idle" ? (
                  <>Demander un tournage <Send className="w-4 h-4 ml-2" /></>
                ) : formStatus === "sending" ? (
                  "Envoi..."
                ) : (
                  "Message Envoyé"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-medium tracking-wider">
            &copy; {new Date().getFullYear()} BENZ AUTO DZ. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium tracking-wider">
            <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-white transition-colors">Mentions Légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
