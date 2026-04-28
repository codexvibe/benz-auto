"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Mail, Phone, MapPin, Send, Camera, Play, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { createClient } from "../../utils/supabase/client";
import { useState } from "react";

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const supabase = createClient();
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: "+213",
    subject: "Acheter un véhicule",
    message: ""
  });

  const socialPlatforms = [
    { name: "Instagram", icon: Camera, color: "hover:text-[#e1306c]" },
    { name: "YouTube", icon: Play, color: "hover:text-[#ff0000]" },
    { name: "Facebook", icon: Globe, color: "hover:text-[#1877f2]" },
    { name: "TikTok", icon: Globe, color: "hover:text-[#ff0050]" },
    { name: "WhatsApp", icon: Phone, color: "hover:text-[#25d366]" },
    { name: "Canal", icon: Send, color: "hover:text-[#0088cc]" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");

    const { error } = await supabase.from("orders").insert([{
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_phone: `${formData.countryCode} ${formData.phone}`,
      items_list: `[CONTACT: ${formData.subject}] ${formData.message}`,
      status: "En attente"
    }]);

    if (!error) {
      setFormStatus("sent");
      setFormData({ firstName: "", lastName: "", phone: "", countryCode: "+213", subject: "Acheter un véhicule", message: "" });
      setTimeout(() => setFormStatus("idle"), 3000);
    } else {
      setFormStatus("idle");
      alert("Erreur lors de l'envoi.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      
      <main className="pt-32 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {/* Left Side: Info */}
              <div>
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase block mb-4"
                >
                  Contactez-nous
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-7xl font-heading font-black mb-12 tracking-tighter"
                >
                  DISCUTONS DE <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500">VOTRE PROJET</span>
                </motion.h1>

                <div className="space-y-10">
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-surface border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
                      <Mail className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Email</div>
                      <div className="text-xl font-medium">{settings?.contact_email || "contact@benzauto.dz"}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-surface border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
                      <Phone className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Téléphone</div>
                      <div className="text-xl font-medium">{settings?.contact_phone || "+213 (0) 555 00 00 00"}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-surface border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
                      <MapPin className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Showroom</div>
                      <div className="text-xl font-medium">{settings?.address || "Alger, Algérie"}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-16 pt-16 border-t border-white/5 flex gap-6 flex-wrap">
                  {settings?.social_links && Object.entries(settings.social_links).map(([name, url]) => {
                    if (!url) return null;
                    const platform = socialPlatforms.find(p => p.name.toLowerCase() === name.toLowerCase()) || { icon: Globe };
                    const Icon = platform.icon;
                    return (
                      <a 
                        key={name}
                        href={url as string} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-surface border border-white/5 hover:border-white/20 transition-all group"
                      >
                        <Icon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Form */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="p-12 rounded-[40px] bg-surface border border-white/10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                
                <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight">Formulaire de contact</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-4">Nom</label>
                      <input 
                        type="text" 
                        required
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-white/30 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-4">Prénom</label>
                      <input 
                        type="text" 
                        required
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-white/30 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-4">Téléphone</label>
                    <div className="flex gap-4">
                      <select 
                        value={formData.countryCode}
                        onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                        className="bg-black/30 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                      >
                        <option value="+213">🇩🇿 +213</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+212">🇲🇦 +212</option>
                        <option value="+216">🇹🇳 +216</option>
                      </select>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="05 55 00 00 00"
                        className="flex-1 bg-black/30 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-white/30 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-4">Objet</label>
                    <select 
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-white/30 transition-all appearance-none"
                    >
                      <option className="bg-surface">Acheter un véhicule</option>
                      <option className="bg-surface">Vendre mon véhicule</option>
                      <option className="bg-surface">Partenariat</option>
                      <option className="bg-surface">Autre</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-4">Message</label>
                    <textarea 
                      rows={4} 
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-3xl py-4 px-6 text-sm focus:outline-none focus:border-white/30 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={formStatus !== "idle"}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 group ${
                      formStatus === "idle" ? "bg-white text-black hover:bg-slate-200" : "bg-white/10 text-white"
                    }`}
                  >
                    {formStatus === "idle" ? "Envoyer le message" : formStatus === "sending" ? "Envoi..." : "Message Envoyé !"}
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
