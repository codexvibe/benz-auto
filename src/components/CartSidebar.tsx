"use client";

import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { CheckoutModal } from './CheckoutModal';
import { useState } from 'react';

export const CartSidebar = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, isSidebarOpen, setIsSidebarOpen, itemCount } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] h-full shadow-2xl border-l border-black/5 dark:border-white/5 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-gray-100 dark:bg-black">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-[#39ff14]" size={24} />
                  <h2 className="font-heading text-2xl text-black dark:text-white uppercase tracking-wider">Mon Panier</h2>
                  <span className="bg-[#39ff14] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center">
                      <ShoppingBag size={40} className="text-black/20 dark:text-white/20" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading text-black dark:text-white uppercase mb-2">Votre panier est vide</h3>
                      <p className="text-[#a1a1aa] font-sans text-sm">Découvrez nos produits et commencez votre shopping !</p>
                    </div>
                    <button 
                      onClick={() => setIsSidebarOpen(false)}
                      className="mt-4 px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-heading uppercase hover:bg-[#39ff14] dark:hover:bg-[#39ff14] hover:text-black dark:hover:text-black transition-colors"
                    >
                      Boutique
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-black rounded-sm border border-black/5 dark:border-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            width={60} 
                            height={60} 
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-heading text-black dark:text-white text-lg leading-tight">{item.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-black/20 dark:text-white/20 hover:text-[#ef4444] dark:hover:text-[#ef4444] transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-[#39ff14] font-bold text-sm mb-3">{item.price}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-black/10 dark:border-white/10 rounded-sm">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 text-black dark:text-white font-sans font-bold text-sm border-x border-black/10 dark:border-white/10">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="text-black dark:text-white font-sans font-bold text-sm">
                              {(parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity).toLocaleString()} DZD
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-6 bg-gray-100 dark:bg-black border-t border-black/5 dark:border-white/5">
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[#a1a1aa] font-sans uppercase tracking-widest text-xs font-bold">Sous-total</span>
                      <span className="text-black dark:text-white font-sans font-bold text-xl">{subtotal.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between items-center text-[#39ff14]">
                      <span className="font-sans uppercase tracking-widest text-[10px] font-bold">Livraison</span>
                      <span className="font-sans text-xs uppercase font-bold">Calculée à l'étape suivante</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full bg-[#39ff14] text-black font-heading text-xl py-5 uppercase flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95 shadow-[0_0_20px_rgba(57,255,20,0.2)]"
                  >
                    Commander
                    <ArrowRight size={22} />
                  </button>
                  
                  <p className="text-center text-[#555] text-[10px] font-bold uppercase tracking-widest mt-4">
                    📦 Livraison rapide 58 Wilayas Algérie 🇩🇿
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
};
