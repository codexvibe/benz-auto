"use client";

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Building2, CheckCircle, Package, Truck, Phone, User, MapPin, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WILAYAS } from '../../data/wilayas';
import { createClient } from '../../utils/supabase/client';

export default function Wholesale() {
  const [formData, setFormData] = useState({
    company: '',
    phone: '',
    wilaya: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.phone || !formData.wilaya) return;
    
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .insert({
          customer_name: `[GROS] ${formData.company}`,
          customer_phone: formData.phone,
          customer_wilaya: formData.wilaya,
          customer_address: formData.message || 'Demande de devis gros',
          items_list: 'DEMANDE DE GROS (B2B)',
          subtotal_price: 0,
          delivery_price: 0,
          total_price: 0,
          status: 'Gros'
        });

      if (error) throw error;
      setIsSuccess(true);
    } catch (err) {
      console.error('Erreur Gros:', err);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Package className="text-[#39ff14]" size={32} />,
      title: "Stock Permanent",
      desc: "Accès prioritaire à toutes les nouveautés Snus et Vapes."
    },
    {
      icon: <Truck className="text-[#39ff14]" size={32} />,
      title: "Logistique 58 Wilayas",
      desc: "Expédition rapide et sécurisée partout en Algérie."
    },
    {
      icon: <CheckCircle className="text-[#39ff14]" size={32} />,
      title: "100% Original",
      desc: "Garantie contre la contrefaçon pour protéger votre réputation."
    }
  ];

  return (
    <>
      <Header />
      
      <main className="bg-black text-white min-h-screen pt-32 pb-20">
        
        {/* Header Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-[#ef4444]/10 border border-[#ef4444] text-[#ef4444] px-4 py-2 rounded-sm font-heading mb-6 tracking-widest uppercase"
            >
              Service Professionnel (B2B)
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-heading uppercase mb-6 leading-none">
              Acheter en <span className="text-[#39ff14]">Gros</span>
            </h1>
            <p className="text-xl text-[#a1a1aa] font-sans max-w-2xl mx-auto mb-10">
              Vous êtes gérant d'un store ou revendeur ? Bénéficiez des meilleurs prix d'Algérie sur le Snus et les Vapes Jetables.
            </p>
            
            {/* Condition Badge */}
            <div className="inline-block bg-[#0f0f0f] border-2 border-dashed border-[#39ff14]/30 px-8 py-4 rounded-sm">
              <p className="text-[#39ff14] font-heading text-2xl uppercase tracking-tighter">
                Minimum de commande : <span className="text-white underline">10 pièces</span>
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="container mx-auto px-4 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0a0a0a] border border-white/5 p-8 flex flex-col items-center text-center group hover:border-[#39ff14]/30 transition-colors"
              >
                <div className="w-16 h-16 bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {b.icon}
                </div>
                <h3 className="text-2xl font-heading uppercase mb-3 text-white">{b.title}</h3>
                <p className="text-[#a1a1aa] font-sans">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Form Section */}
        <section className="container mx-auto px-4 relative">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[#39ff14]/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
          
          <div className="max-w-2xl mx-auto bg-[#0f0f0f] border border-white/10 overflow-hidden relative">
            
            <div className="bg-gradient-to-r from-[#39ff14]/20 to-transparent p-6 border-b border-[#39ff14]/20">
              <h2 className="text-3xl font-heading uppercase text-white">Demande de prix de gros</h2>
              <p className="text-sm text-[#a1a1aa] font-medium uppercase tracking-widest mt-1">Réponse garantie sous 24h</p>
            </div>

            <div className="p-8">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center gap-6"
                >
                  <div className="w-20 h-20 bg-[#39ff14]/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-[#39ff14]" size={48} />
                  </div>
                  <h3 className="text-3xl font-heading uppercase">Demande envoyée !</h3>
                  <p className="text-[#a1a1aa] font-sans">
                    Merci pour votre confiance. Nous allons vous contacter par téléphone pour discuter des tarifs de gros.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-8 py-3 border border-[#39ff14] text-[#39ff14] font-heading uppercase hover:bg-[#39ff14] hover:text-black transition-colors"
                  >
                    Envoyer une autre demande
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleOrder} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Nom Magasin */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Nom du Magasin / Responsable *</label>
                      <div className="relative">
                        <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                        <input
                          required
                          type="text"
                          placeholder="Ex: Vape Store Alger"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="w-full bg-[#050505] border border-white/10 text-white pl-10 pr-4 py-4 focus:border-[#39ff14] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Téléphone */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Téléphone Mobile *</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                        <input
                          required
                          type="tel"
                          placeholder="05 / 06 / 07 ..."
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-[#050505] border border-white/10 text-white pl-10 pr-4 py-4 focus:border-[#39ff14] outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wilaya */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Votre Wilaya *</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                      <select
                        required
                        value={formData.wilaya}
                        onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                        className="w-full bg-[#050505] border border-white/10 text-white pl-10 pr-4 py-4 focus:border-[#39ff14] outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Sélectionnez une wilaya</option>
                        {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]">▼</div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Quels produits vous intéressent ?</label>
                    <textarea
                      rows={4}
                      placeholder="Ex: Snus Pablo Ice Cold (30 boites), Tornado 9K (20 pièces)..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#050505] border border-white/10 text-white p-4 focus:border-[#39ff14] outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 w-full bg-[#39ff14] text-black font-heading text-2xl py-5 uppercase flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                    {isSubmitting ? "Envoi en cours..." : "Demander mes tarifs pro"}
                  </button>

                  <p className="text-center text-[10px] text-[#555] font-bold uppercase tracking-widest">
                    ⚠️ Reservé aux revendeurs · Livraison express disponible
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
