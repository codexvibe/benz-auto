"use client";

import React, { useState } from 'react';
import { X, Send, CheckCircle, Loader2, MapPin, Phone, User, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WILAYAS } from '../data/wilayas';
import { createClient } from '../utils/supabase/client';
import { useCart } from '../context/CartContext';
import { getDeliveryPrice } from '../utils/delivery';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { cart, subtotal, clearCart, setIsSidebarOpen } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const deliveryPrice = getDeliveryPrice(wilaya);
  const total = subtotal + deliveryPrice;

  const resetForm = () => {
    setName('');
    setPhone('');
    setWilaya('');
    setAddress('');
    setIsSuccess(false);
  };

  const handleClose = () => {
    if (isSuccess) {
      clearCart();
      setIsSidebarOpen(false);
    }
    resetForm();
    onClose();
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !wilaya || cart.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      
      // On crée un résumé des produits pour la table
      const productsSummary = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');

      const { error } = await supabase
        .from('orders')
        .insert({
          customer_name: name,
          customer_phone: phone,
          customer_wilaya: wilaya,
          customer_address: address || 'Non précisée',
          product_name: productsSummary,
          product_price: `${total.toLocaleString()} DZD (Prod: ${subtotal}, Liv: ${deliveryPrice})`,
          status: 'Panier'
        });

      if (error) throw error;
      setIsSuccess(true);
    } catch (err) {
      console.error('Erreur Checkout:', err);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = name.trim() && phone.trim() && wilaya && cart.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={handleClose} />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#39ff14]/20 to-transparent border-b border-[#39ff14]/30 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="font-heading text-2xl text-white uppercase tracking-wider">Finaliser la commande</h2>
                <p className="text-[#a1a1aa] text-xs font-bold uppercase tracking-widest">{cart.length} article(s) · Paiement à la livraison</p>
              </div>
              <button onClick={handleClose} className="text-white/50 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 flex flex-col items-center text-center gap-6"
              >
                <div className="w-24 h-24 rounded-full bg-[#39ff14]/10 flex items-center justify-center">
                  <CheckCircle size={56} className="text-[#39ff14]" />
                </div>
                <h3 className="font-heading text-4xl text-white uppercase">COMMANDE VALIDÉE !</h3>
                <p className="text-[#a1a1aa] font-sans">
                  Merci <span className="text-white font-bold">{name}</span> ! Votre commande d'un montant de <span className="text-[#39ff14] font-bold">{total.toLocaleString()} DZD</span> a bien été enregistrée.
                </p>
                <p className="text-sm text-[#a1a1aa] bg-white/5 px-4 py-2 rounded-sm italic">
                  Nous vous appellerons sous peu au <span className="text-white font-bold">{phone}</span> pour confirmer l'expédition.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-4 w-full bg-[#39ff14] text-black font-heading text-xl py-4 uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                >
                  Retour au site
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col">
                {/* Order Summary Recap (Mini) */}
                <div className="bg-white/2 p-4 border-b border-white/5">
                  <div className="flex justify-between text-xs text-[#a1a1aa] uppercase font-bold tracking-widest mb-1">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#39ff14] uppercase font-bold tracking-widest">
                    <span>Livraison ({wilaya || 'Sél. Wilaya'})</span>
                    <span>{deliveryPrice > 0 ? `${deliveryPrice} DZD` : '---'}</span>
                  </div>
                  <div className="flex justify-between text-lg text-white font-heading uppercase mt-2 pt-2 border-t border-white/5">
                    <span>TOTAL À PAYER</span>
                    <span className="text-glow-green">{total.toLocaleString()} DZD</span>
                  </div>
                </div>

                <form onSubmit={handleOrder} className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-[#a1a1aa] tracking-widest">Nom & Prénom *</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                      <input
                        required
                        type="text"
                        placeholder="Mohamed Benali"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 text-white pl-10 pr-4 py-3 focus:border-[#39ff14] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-[#a1a1aa] tracking-widest">Téléphone *</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                      <input
                        required
                        type="tel"
                        placeholder="05 / 06 / 07 ..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 text-white pl-10 pr-4 py-3 focus:border-[#39ff14] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-[#a1a1aa] tracking-widest">Wilaya *</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                      <select
                        required
                        value={wilaya}
                        onChange={(e) => setWilaya(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 text-white pl-10 pr-4 py-3 focus:border-[#39ff14] outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Sélectionnez votre Wilaya</option>
                        {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]">▼</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-[#a1a1aa] tracking-widest">Adresse de livraison (Optionnel)</label>
                    <input
                      type="text"
                      placeholder="Rue, Quartier, N° Maison..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 focus:border-[#39ff14] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="mt-4 w-full bg-[#39ff14] text-black font-heading text-2xl py-5 uppercase flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Package size={24} />}
                    {isSubmitting ? "Validation..." : "Confirmer ma commande"}
                  </button>

                  <p className="text-center text-[10px] text-[#555] font-bold uppercase tracking-widest">
                    🚚 Livraison express en Algérie · Paiement Cash à la réception
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
