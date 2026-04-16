"use client";

import React, { useState } from 'react';
import { X, Send, CheckCircle, Loader2, MapPin, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WILAYAS } from '../data/wilayas';
import { createClient } from '../utils/supabase/client';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productPrice: string;
}

export const OrderModal = ({ isOpen, onClose, productName, productPrice }: OrderModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resetForm = () => {
    setName('');
    setPhone('');
    setWilaya('');
    setAddress('');
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleOrder = async () => {
    if (!name || !phone || !wilaya) return;
    
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .insert({
          customer_name: name,
          customer_phone: phone,
          customer_wilaya: wilaya,
          customer_address: address || 'Non précisée',
          product_name: productName,
          product_price: productPrice,
          status: 'Nouvelle'
        });

      if (error) throw error;
      setIsSuccess(true);
    } catch (err) {
      console.error('Erreur lors de la commande:', err);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = name.trim() && phone.trim() && wilaya;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#39ff14]/20 to-transparent border-b border-[#39ff14]/30 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="font-heading text-2xl text-white uppercase">Commander</h2>
                <p className="text-[#39ff14] text-sm font-bold">{productName} — {productPrice}</p>
              </div>
              <button onClick={handleClose} className="text-white/50 hover:text-white p-1">
                <X size={24} />
              </button>
            </div>

            {/* Contenu */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 flex flex-col items-center text-center gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-[#39ff14]/10 flex items-center justify-center">
                  <CheckCircle size={48} className="text-[#39ff14]" />
                </div>
                <h3 className="font-heading text-3xl text-white uppercase">Commande Reçue !</h3>
                <p className="text-[#a1a1aa] font-sans">
                  Merci <span className="text-white font-bold">{name}</span> ! Nous allons vous contacter au <span className="text-[#39ff14] font-bold">{phone}</span> pour confirmer votre livraison.
                </p>
                <p className="text-xs text-[#a1a1aa]">📍 Livraison vers {wilaya}</p>
                <button
                  onClick={handleClose}
                  className="mt-4 w-full bg-[#39ff14] text-black font-heading text-xl py-4 uppercase hover:bg-[#32e012] transition-colors"
                >
                  Fermer
                </button>
              </motion.div>
            ) : (
              <div className="p-6 flex flex-col gap-4">
                {/* Nom */}
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
                  <input
                    type="text"
                    placeholder="Votre nom complet *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 text-white placeholder-[#555] pl-10 pr-4 py-3 font-sans focus:border-[#39ff14] focus:outline-none transition-colors"
                  />
                </div>

                {/* Téléphone */}
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
                  <input
                    type="tel"
                    placeholder="Numéro de téléphone * (ex: 0550123456)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 text-white placeholder-[#555] pl-10 pr-4 py-3 font-sans focus:border-[#39ff14] focus:outline-none transition-colors"
                  />
                </div>

                {/* Wilaya */}
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
                  <select
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 text-white pl-10 pr-4 py-3 font-sans focus:border-[#39ff14] focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="text-[#555]">Sélectionnez votre Wilaya *</option>
                    {WILAYAS.map((w) => (
                      <option key={w} value={w} className="bg-[#111] text-white">{w}</option>
                    ))}
                  </select>
                </div>

                {/* Adresse */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Adresse de livraison (optionnel)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 text-white placeholder-[#555] px-4 py-3 font-sans focus:border-[#39ff14] focus:outline-none transition-colors"
                  />
                </div>

                {/* Bouton Commander */}
                <button
                  onClick={handleOrder}
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-4 font-heading text-xl uppercase flex items-center justify-center gap-3 transition-all duration-300 mt-2 ${
                    isFormValid
                      ? 'bg-[#39ff14] text-black hover:bg-[#32e012] cursor-pointer'
                      : 'bg-[#1a1a1a] text-[#555] cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <Send size={22} />
                  )}
                  {isSubmitting ? 'Envoi en cours...' : 'Confirmer la commande'}
                </button>

                <p className="text-center text-[#555] text-xs font-sans mt-1">
                  💳 Paiement à la livraison (COD) — 🚚 Livraison 58 Wilayas
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
