"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { createClient } from "../utils/supabase/client";
import { 
  Globe, 
  MessageCircle, // For WhatsApp/Canal
  Camera, // For Instagram fallback
  Play, // For Youtube fallback
  Send,
  Phone,
  Car,
  Mail,
  MapPin
} from "lucide-react";

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
  const { settings } = useSiteSettings();
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formData, setFormData] = useState({ name: "", phone: "", car: "" });
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const socialPlatforms = [
    { name: "Instagram", icon: Camera, color: "hover:text-[#e1306c]" },
    { name: "YouTube", icon: Play, color: "hover:text-[#ff0000]" },
    { name: "Facebook", icon: Globe, color: "hover:text-[#1877f2]" },
    { name: "TikTok", icon: Globe, color: "hover:text-[#ff0050]" },
    { name: "X", icon: Globe, color: "hover:text-[#1da1f2]" },
    { name: "LinkedIn", icon: Globe, color: "hover:text-[#0a66c2]" },
    { name: "WhatsApp", icon: Phone, color: "hover:text-[#25d366]" },
    { name: "Canal", icon: Send, color: "hover:text-[#0088cc]" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    
    const { error } = await supabase.from("orders").insert([{
      customer_name: formData.name,
      customer_phone: formData.phone,
      items_list: `[TOURNAGE] ${formData.car}`,
      status: "En attente"
    }]);

    if (!error) {
      setFormStatus("sent");
      setFormData({ name: "", phone: "", car: "" });
      setTimeout(() => setFormStatus("idle"), 3000);
    } else {
      setFormStatus("idle");
      alert("Une erreur est survenue lors de l'envoi.");
    }
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
                {settings?.site_name?.split(' ')[0] || "BENZ"} <span className="text-brand-red">{settings?.site_name?.split(' ').slice(1).join(' ') || "AUTO DZ"}</span>
              </span>
            </Link>
            <p className="text-slate-400 mb-10 text-sm leading-relaxed font-light">
              {settings?.site_description || "L'excellence de la vente automobile. Nous réalisons des vidéos professionnelles de votre véhicule pour le vendre au meilleur prix, et nous vous proposons une sélection exclusive de voitures de luxe."}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              {settings?.social_links && Object.entries(settings.social_links).map(([name, url]) => {
                if (!url) return null;
                const platform = socialPlatforms.find(p => p.name.toLowerCase() === name.toLowerCase()) || { icon: Globe, color: "hover:text-white" };
                const Icon = platform.icon;
                return (
                  <a 
                    key={name}
                    href={url as string} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center hover:border-brand-red hover:bg-brand-red/5 text-white transition-all duration-500 group hover:box-glow-red"
                  >
                    <Icon className={`w-5 h-5 ${platform.color} transition-colors duration-500`} />
                  </a>
                );
              })}
              {(!settings?.social_links || Object.keys(settings.social_links).length === 0) && (
                <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Suivez-nous</p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-8 text-xs tracking-[0.2em] uppercase">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-brand-red transition-colors"></span>
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-brand-red transition-colors"></span>
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
                <span className="text-slate-400 text-sm mt-1">
                  {mounted ? (settings?.address || "Alger, Algérie") : <span className="opacity-0">Chargement...</span>}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                {mounted ? (
                  <a href={`tel:${settings?.contact_phone}`} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {settings?.contact_phone || "+213 00 00 00 00"}
                  </a>
                ) : <span className="opacity-0">+213 00 00 00 00</span>}
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                {mounted ? (
                  <a href={`mailto:${settings?.contact_email}`} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {settings?.contact_email || "contact@benzautodz.com"}
                  </a>
                ) : <span className="opacity-0">contact@benzautodz.com</span>}
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
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-slate-600"
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  placeholder="Téléphone" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-surface border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-slate-600"
                />
              </div>
              <div>
                <textarea 
                  placeholder="Modèle de la voiture à vendre..." 
                  rows={2}
                  required
                  value={formData.car}
                  onChange={e => setFormData({ ...formData, car: e.target.value })}
                  className="w-full bg-surface border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all resize-none placeholder:text-slate-600"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={formStatus !== "idle"}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                  formStatus === "idle" 
                    ? "bg-white text-black hover:bg-brand-red hover:text-white hover:box-glow-red" 
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
            &copy; {new Date().getFullYear()} {settings?.site_name || "BENZ AUTO DZ"}. Tous droits réservés.
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
