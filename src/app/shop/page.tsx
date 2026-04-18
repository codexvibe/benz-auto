"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ShoppingCart, LayoutGrid, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '../../utils/supabase/client';
import { useCart } from '../../context/CartContext';

const supabase = createClient();

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
  flavors?: (string | { name: string; detail: string })[];
}

const fallbackProducts: Product[] = [
  { id: 1, name: 'PABLO ICE COLD', category: 'Snus', price: '1 200 DZD', oldPrice: '1 500 DZD', image: '/assets/snus_pablo.png', badge: 'TOP VENTE 🔥', badgeColor: 'bg-[#ef4444]', glowColor: 'box-glow-green-hover' },
  { id: 2, name: 'KILLA COLD MINT', category: 'Snus', price: '1 100 DZD', oldPrice: null, image: '/assets/snus_pablo.png', badge: 'FORT 💪', badgeColor: 'bg-[#ff00ff]', glowColor: 'hover:shadow-[0_0_25px_rgba(255,0,255,0.6)]' },
  { id: 3, name: 'RABBIT BLUE ICE', category: 'Snus', price: '1 300 DZD', oldPrice: null, image: '/assets/snus_pablo.png', badge: 'NEW BRAND', badgeColor: 'bg-blue-400 text-black', glowColor: 'box-glow-green-hover' },
  { id: 4, name: 'VELO FREEZE MAX', category: 'Snus', price: '1 000 DZD', oldPrice: null, image: '/assets/snus_pablo.png', badge: 'DISCRET', badgeColor: 'bg-white text-black border', glowColor: 'box-glow-green-hover' },
  { id: 5, name: 'TORNADO 9000 PRO', category: 'Puff 9k', price: '3 500 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: '9000 PUFFS ⚡', badgeColor: 'bg-[#facc15] text-black', glowColor: 'hover:shadow-[0_0_25px_rgba(250,204,21,0.6)]' },
  { id: 6, name: 'TORNADO 12000 PRO', category: 'Puff 12k', price: '4 200 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: '12000 PUFFS 🚀', badgeColor: 'bg-orange-600', glowColor: 'hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]' },
  { id: 7, name: 'JNR ROCKET 25K', category: 'Puff 25k', price: '4 500 DZD', oldPrice: '5 000 DZD', image: '/assets/vape_tornado.png', badge: 'MAX PUFFS 🌪️', badgeColor: 'bg-blue-600', glowColor: 'hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]' },
  { id: 8, name: 'JNR ALIEN 10K', category: 'Puff 10k', price: '4 000 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: 'PROMO 🎁', badgeColor: 'bg-[#39ff14] text-black', glowColor: 'box-glow-green-hover' },
  { id: 9, name: 'SALT E-LIQUID MENTHE', category: 'E-Liquides', price: '1 500 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: 'NIC SALT', badgeColor: 'bg-indigo-600', glowColor: 'box-glow-green-hover' },
  { id: 10, name: 'BIG BOY 100ML', category: 'E-Liquides', price: '2 500 DZD', oldPrice: '3 000 DZD', image: '/assets/vape_tornado.png', badge: 'FORMAT XL', badgeColor: 'bg-green-600', glowColor: 'box-glow-green-hover' },
  { id: 11, name: 'PACK SNUS 10 PCS', category: 'Gros', price: '10 000 DZD', oldPrice: '12 000 DZD', image: '/assets/snus_pablo.png', badge: 'VENTE EN GROS', badgeColor: 'bg-black text-yellow-400', glowColor: 'box-glow-green-hover' },
  { id: 12, name: 'PACK PUFF 5 PCS', category: 'Gros', price: '15 000 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: 'PRIX DE GROS', badgeColor: 'bg-black text-blue-400', glowColor: 'box-glow-green-hover' },
  { id: 13, name: 'RÉSISTANCE TORNADO', category: 'Accessoires', price: '800 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: 'PIÈCE ORIGINALE', badgeColor: 'bg-slate-500', glowColor: 'box-glow-green-hover' },
  { id: 14, name: 'CHARGEUR USB-C RAPIDE', category: 'Accessoires', price: '1 200 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: 'ESSENTIEL', badgeColor: 'bg-slate-800', glowColor: 'box-glow-green-hover' },
  { id: 15, name: 'BATTERIE 18650', category: 'Accessoires', price: '1 500 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: 'PUISSANCE', badgeColor: 'bg-red-800', glowColor: 'box-glow-green-hover' },
  { id: 16, name: 'ÉTUI DE TRANSPORT', category: 'Accessoires', price: '900 DZD', oldPrice: null, image: '/assets/vape_tornado.png', badge: 'PROTECTION', badgeColor: 'bg-gray-700', glowColor: 'box-glow-green-hover' }
];
  // Les catégories dynamiques seront générées à partir des produits.

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [selectedFlavors, setSelectedFlavors] = useState<Record<number, string>>({});
  const { addToCart } = useCart();

  const availableCategories = Array.from(new Set(['Toutes', 'Promotions', ...products.map(p => p.category?.trim() || 'Non classé')]));

  useEffect(() => {
    const fetchProducts = async () => {
      // Si les clés Supabase ne sont pas configurées, on garde le fallback
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_visible', true);
          
        if (data && data.length > 0) {
          const mappedData: Product[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            oldPrice: item.old_price,
            image: item.image_url,
            badge: item.badge,
            badgeColor: item.badge_color || 'bg-[#ef4444]',
            glowColor: item.glow_color || 'box-glow-green-hover',
            flavors: item.flavors || []
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
    : activeCategory === 'Promotions'
      ? products.filter(p => (p.oldPrice && p.oldPrice !== '') || (p.badge && p.badge.toLowerCase().includes('promo')))
      : products.filter(p => (p.category?.trim() || 'Non classé').toLowerCase() === activeCategory.trim().toLowerCase());

  return (
    <>
      <Header />
      
      <main className="pt-40 pb-20 bg-gray-50 dark:bg-black min-h-screen">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-black/10 dark:border-white/10 pb-6 gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-heading text-black dark:text-white mb-2 uppercase">
                NOTRE <span className="text-[#39ff14]">STOCK</span>
              </h1>
              <p className="text-[#a1a1aa] font-sans">Livraison dans tout le territoire national (58 wilayas).</p>
            </div>
            
            <button 
              className="md:hidden w-full bg-white dark:bg-[#0f0f0f] border border-black/20 dark:border-white/20 text-black dark:text-white font-heading text-xl py-4 flex items-center justify-center gap-3 uppercase"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Filter size={24} />
              Filtrer les produits
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden md:block w-64 shrink-0">
              <div className="sticky top-40 bg-white dark:bg-[#0f0f0f] border border-black/10 dark:border-white/10 p-6">
                <h3 className="font-heading text-2xl text-black dark:text-white mb-6 flex items-center gap-2 uppercase">
                  <LayoutGrid size={20} className="text-[#39ff14]" />
                  Catégories
                </h3>
                <ul className="flex flex-col gap-3 font-sans">
                  {availableCategories.map((cat) => (
                    <li key={cat}>
                      <button 
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left py-2 px-3 transition-colors ${
                          activeCategory === cat 
                            ? 'bg-[#39ff14] text-black font-bold' 
                            : 'text-gray-600 hover:text-black hover:bg-black/5 dark:text-[#a1a1aa] dark:hover:text-white dark:hover:bg-white/5'
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={product.id}
                      className={`bg-white dark:bg-[#0f0f0f] border border-black/5 dark:border-white/5 p-4 flex flex-col group transition-all duration-500 hover:-translate-y-3 hover:shadow-xl ${product.glowColor} relative`}
                      onClick={() => {
                        import('../../app/admin/actions').then(m => m.incrementProductViewAction(product.id));
                      }}
                    >
                      {product.badge && (
                        <div className={`absolute top-4 left-4 z-10 ${product.badgeColor} px-3 py-1 font-heading text-sm tracking-wider uppercase`}>
                          {product.badge}
                        </div>
                      )}

                      <div className="h-64 w-full relative mb-6 bg-gray-100 dark:bg-black rounded-sm flex items-center justify-center p-4">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          loading="lazy"
                          className="w-full h-full object-contain group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3 drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-500 ease-out" 
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <span className="text-xs text-[#a1a1aa] font-bold tracking-widest uppercase mb-1">{product.category}</span>
                        <h3 className="font-heading text-xl md:text-2xl text-black dark:text-white mb-2">{product.name}</h3>
                        
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-2xl font-bold font-sans text-[#39ff14]">{product.price}</span>
                          {product.oldPrice && (
                            <span className="text-base font-bold font-sans text-[#ef4444] line-through">{product.oldPrice}</span>
                          )}
                        </div>

                        {product.flavors && product.flavors.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {product.flavors.slice(0, 3).map((f: any, i) => (
                              <span key={i} className="text-[8px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-1.5 py-0.5 text-black/40 dark:text-white/40 uppercase">
                                {typeof f === 'string' ? f : f.name}
                              </span>
                            ))}
                            {product.flavors.length > 3 && <span className="text-[8px] text-white/20">+{product.flavors.length - 3}</span>}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 relative z-10 pt-4 border-t border-black/5 dark:border-white/5">
                        <div className="flex gap-2">
                          <Link href={`/product/${product.id}`} className="flex-1 bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-black dark:text-white font-heading py-2 text-center text-xs uppercase tracking-widest transition-all">
                            Voir Détails
                          </Link>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const firstFlavor = product.flavors?.[0];
                              const flavor = typeof firstFlavor === 'string' 
                                ? firstFlavor 
                                : (firstFlavor as any)?.name || '';
                              addToCart(product as any, flavor);
                            }}
                            className="flex-1 bg-[#39ff14] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black font-heading py-2 text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                          >
                            <ShoppingCart size={14} /> Acheter
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
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
            className="fixed inset-0 z-50 bg-white dark:bg-[#0f0f0f] flex flex-col pt-6 md:hidden"
          >
            <div className="flex justify-between items-center px-6 pb-6 border-b border-black/10 dark:border-white/10">
              <h2 className="font-heading text-3xl text-black dark:text-white uppercase">Filtres</h2>
              <button 
                className="text-black dark:text-white p-2 hover:text-[#ef4444]"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <X size={32} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <ul className="flex flex-col gap-4 font-sans text-xl">
                {availableCategories.map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => {
                        setActiveCategory(cat);
                        setIsMobileFiltersOpen(false);
                      }}
                      className={`w-full text-left py-4 px-4 border ${
                        activeCategory === cat 
                          ? 'bg-[#39ff14] text-black border-[#39ff14] font-bold' 
                          : 'text-black dark:text-white border-black/20 dark:border-white/20'
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
