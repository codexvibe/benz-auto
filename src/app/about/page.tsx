"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Award, Camera, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const stats = [
    { label: "Vidéos Produites", value: "250+" },
    { label: "Véhicules Vendus", value: "180+" },
    { label: "Abonnés Cumulés", value: "500K+" },
    { label: "Satisfaction Client", value: "100%" },
  ];

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      
      <main className="pt-32 pb-32">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase block mb-4"
            >
              Notre Histoire
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-heading font-black mb-8 tracking-tighter"
            >
              L'EXCELLENCE <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500">EN MOUVEMENT</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 font-light leading-relaxed"
            >
              Benz Auto DZ n'est pas qu'un simple showroom. C'est une plateforme révolutionnaire qui allie production cinématographique et expertise automobile pour sublimer chaque véhicule.
            </motion.p>
          </div>
        </section>

        {/* Vision Section */}
        <section className="container mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative rounded-3xl overflow-hidden aspect-video border border-white/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop" 
                alt="Shooting automobile" 
                className="w-full h-full object-cover grayscale opacity-60"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background to-transparent"></div>
            </motion.div>
            
            <div>
              <h2 className="text-3xl font-bold mb-8">Notre Vision</h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Nous avons compris que l'achat d'un véhicule d'exception commence par une émotion. C'est pourquoi nous avons investi dans les meilleurs équipements de tournage pour créer des "Cinematic Reels" qui capturent l'âme de chaque voiture.
              </p>
              <ul className="space-y-4">
                {[
                  "Mise en valeur cinématographique",
                  "Transparence totale sur l'état du véhicule",
                  "Accompagnement personnalisé",
                  "Réseau exclusif en Algérie"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-medium uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 mb-32 py-20 glass-dark rounded-[40px] border border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-black mb-2 text-glow-chrome">{stat.value}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-10 rounded-3xl bg-surface border border-white/5 hover:border-white/20 transition-all group">
              <Camera className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform text-white" />
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Production Pro</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Des caméras 4K et des stabilisateurs de pointe pour un rendu digne des plus grands constructeurs.
              </p>
            </div>
            <div className="p-10 rounded-3xl bg-surface border border-white/5 hover:border-white/20 transition-all group">
              <Shield className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform text-white" />
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Confiance</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Chaque véhicule est minutieusement inspecté avant d'être proposé à notre communauté.
              </p>
            </div>
            <div className="p-10 rounded-3xl bg-surface border border-white/5 hover:border-white/20 transition-all group">
              <Award className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform text-white" />
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Expertise</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Une équipe passionnée par l'automobile et l'image, pour un service irréprochable.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
