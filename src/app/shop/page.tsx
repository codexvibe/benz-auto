"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ShoppingCart, LayoutGrid, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import { supabase } from '../../lib/supabase';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  oldPrice: string | null;
  image: string;
  badge: string;
  badgeColor: string;
  glowColor: string;
}

const fallbackProducts: Product[] = [
  { id: 1, name: 'PABLO ICE COLD', category: 'Snus', price: '1 200 DZD', oldPrice: '1 500 DZD', image: '/assets/snus_pablo.png', badge: 'TOP VENTE 🔥', badgeColor: 'bg-[#ef4444]', glowColor: 'box-glow-green-hover' },
  { id: 2, name: 'TORNADO 9000 PRO', category: 'Vape Jetable', price: '3 500 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: 'NOUVEAU ⚡', badgeColor: 'bg-[#facc15] text-black', glowColor: 'hover:shadow-[0_0_25px_rgba(250,204,21,0.6)]' },
  { id: 3, name: 'KILLA COLD MINT', category: 'Snus', price: '1 100 DZD', oldPrice: null, image: '/assets/snus_pablo.png', badge: 'FORT 💪', badgeColor: 'bg-[#ff00ff]', glowColor: 'hover:shadow-[0_0_25px_rgba(255,0,255,0.6)]' },
  { id: 4, name: 'JNR ALIEN 10K', category: 'Vape Jetable', price: '4 000 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: 'PROMO 🎁', badgeColor: 'bg-[#39ff14] text-black', glowColor: 'box-glow-green-hover' },
  { id: 5, name: 'VELO FREEZE MAX', category: 'Snus', price: '1 000 DZD', oldPrice: null, image: '/assets/snus_pablo.png', badge: '', badgeColor: '', glowColor: 'box-glow-green-hover' },
  { id: 6, name: 'ELFBAR 600 V2', category: 'Vape Jetable', price: '1 800 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: 'CLASSIC', badgeColor: 'bg-white text-black', glowColor: 'box-glow-green-hover' },
  { id: 7, name: 'CUBA BLACK LINE', category: 'Snus', price: '1 400 DZD', oldPrice: null, image: '/assets/snus_pablo.png', badge: 'EXTRÊME ☠️', badgeColor: 'bg-black text-white border border-[#ef4444]', glowColor: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]' },
  { id: 8, name: 'CRYSTAL BAR 4000', category: 'Vape Jetable', price: '2 800 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: '', badgeColor: '', glowColor: 'box-glow-green-hover' }
];

const categories = ['Toutes', 'Snus', 'Vape Jetable', 'Puff', 'E-Liquides'];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      // Si les clés Supabase ne sont pas configurées, on garde le fallback
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        if (data && data.length > 0) {
          const mappedData: Product[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            oldPrice: item.old_price,
            image: item.image_url,
            badge: item.badge,
            badgeColor: item.badge_color,
            glowColor: item.glow_color
          }));
          setProducts(mappedData);
        }
      } catch (err) {
        console.error('Erreur Supabase, fallback utilisé:', err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'Toutes' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <>
      <Header />
      
      <main className="pt-40 pb-20 bg-black min-h-screen">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-6 gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-heading text-white mb-2 uppercase">
                NOTRE <span className="text-[#39ff14]">STOCK</span>
              </h1>
              <p className="text-[#a1a1aa] font-sans">Livraison dans tout le territoire national (58 wilayas).</p>
            </div>
            
            <button 
              className="md:hidden w-full bg-[#0f0f0f] border border-white/20 text-white font-heading text-xl py-4 flex items-center justify-center gap-3 uppercase"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Filter size={24} />
              Filtrer les produits
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden md:block w-64 shrink-0">
              <div className="sticky top-40 bg-[#0f0f0f] border border-white/10 p-6">
                <h3 className="font-heading text-2xl text-white mb-6 flex items-center gap-2 uppercase">
                  <LayoutGrid size={20} className="text-[#39ff14]" />
                  Catégories
                </h3>
                <ul className="flex flex-col gap-3 font-sans">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button 
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left py-2 px-3 transition-colors ${
                          activeCategory === cat 
                            ? 'bg-[#39ff14] text-black font-bold' 
                            : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={product.id}
                      className={`bg-[#0f0f0f] border border-white/5 p-4 flex flex-col group transition-all duration-300 ${product.glowColor} relative overflow-hidden`}
                    >
                      {product.badge && (
                        <div className={`absolute top-4 left-4 z-10 ${product.badgeColor} px-3 py-1 font-heading text-sm tracking-wider uppercase`}>
                          {product.badge}
                        </div>
                      )}

                      <div className="h-64 w-full relative mb-6 bg-black rounded-sm overflow-hidden flex items-center justify-center p-4">
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          width={180}
                          height={180}
                          className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 will-change-transform"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <span className="text-xs text-[#a1a1aa] font-bold tracking-widest uppercase mb-1">{product.category}</span>
                        <h3 className="font-heading text-xl md:text-2xl text-white mb-2">{product.name}</h3>
                        
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-2xl font-bold font-sans text-[#39ff14]">{product.price}</span>
                        </div>

                        <button className="mt-auto w-full bg-white text-black font-heading text-lg py-3 flex items-center justify-center gap-2 uppercase hover:bg-[#39ff14] transition-colors">
                          <ShoppingCart size={20} />
                          Commander
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-2xl font-heading text-[#a1a1aa] uppercase">Aucun produit dans cette catégorie.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#0f0f0f] flex flex-col pt-6 md:hidden"
          >
            <div className="flex justify-between items-center px-6 pb-6 border-b border-white/10">
              <h2 className="font-heading text-3xl text-white uppercase">Filtres</h2>
              <button 
                className="text-white p-2 hover:text-[#ef4444]"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <X size={32} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <ul className="flex flex-col gap-4 font-sans text-xl">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => {
                        setActiveCategory(cat);
                        setIsMobileFiltersOpen(false);
                      }}
                      className={`w-full text-left py-4 px-4 border ${
                        activeCategory === cat 
                          ? 'bg-[#39ff14] text-black border-[#39ff14] font-bold' 
                          : 'text-white border-white/20'
                      } uppercase font-heading`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
