"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ShoppingCart, Percent, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { createClient } from '../../utils/supabase/client';
import { useCart } from '../../context/CartContext';

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

const fallbackPromos: Product[] = [
  { id: 1, name: 'PABLO ICE COLD', category: 'Snus', price: '1 200 DZD', oldPrice: '1 500 DZD', image: '/assets/snus_pablo.png', badge: 'PROMO 🔥', badgeColor: 'bg-[#ef4444]', glowColor: 'box-glow-green-hover' },
  { id: 2, name: 'TORNADO 9000 PRO', category: 'Vape Jetable', price: '3 500 DZD', oldPrice: '4 200 DZD', image: '/assets/vape_tornado.png', badge: '-17%', badgeColor: 'bg-[#ef4444]', glowColor: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]' },
];

export default function Promos() {
  const [products, setProducts] = useState<Product[]>(fallbackPromos);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPromos = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .not('old_price', 'is', null);

        if (data && data.length > 0) {
          const mappedData: Product[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            oldPrice: item.old_price,
            image: item.image_url,
            badge: item.badge || 'PROMO 🔥',
            badgeColor: item.badge_color || 'bg-[#ef4444]',
            glowColor: item.glow_color || 'box-glow-green-hover'
          }));
          setProducts(mappedData);
        }
      } catch (err) {
        console.error('Erreur Supabase promos:', err);
      }
    };

    fetchPromos();
  }, []);

  return (
    <>
      <Header />
      
      <main className="pt-40 pb-20 bg-gray-50 dark:bg-black min-h-screen">
        <div className="container mx-auto px-4">
          
          {/* En-tête de page */}
          <div className="mb-12 border-b border-black/10 dark:border-white/10 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center">
                <Percent size={24} className="text-[#ef4444]" />
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-heading text-black dark:text-white uppercase">
                  PROMO<span className="text-[#ef4444]">TIONS</span>
                </h1>
              </div>
            </div>
            <p className="text-[#a1a1aa] font-sans text-lg">
              Offres limitées. Ces produits sont en promotion — profitez-en avant qu'il ne soit trop tard !
            </p>
          </div>

          {/* Banner Promo */}
          <div className="bg-gradient-to-r from-[#ef4444]/20 via-[#ef4444]/5 to-transparent border border-[#ef4444]/20 p-6 mb-10 flex flex-col sm:flex-row items-center gap-4">
            <Tag size={32} className="text-[#ef4444] shrink-0" />
            <div>
              <p className="font-heading text-xl sm:text-2xl text-black dark:text-white uppercase">
                Prix barrés = Économies garanties
              </p>
              <p className="text-[#a1a1aa] text-sm font-sans">
                Tous les produits affichés ici ont un ancien prix barré. Dès qu'un produit n'est plus en promo, il disparaît automatiquement de cette page.
              </p>
            </div>
          </div>

          {/* Grille des produits en promo */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  key={product.id}
                  className={`bg-white dark:bg-[#0f0f0f] border border-[#ef4444]/10 p-4 flex flex-col group transition-all duration-300 ${product.glowColor} relative overflow-hidden shadow-sm`}
                >
                  {/* Badge PROMO */}
                  <div className={`absolute top-4 left-4 z-10 ${product.badgeColor} px-3 py-1 font-heading text-sm tracking-wider uppercase`}>
                    {product.badge}
                  </div>

                  {/* Image */}
                  <div className="h-56 sm:h-64 w-full relative mb-6 bg-gray-100 dark:bg-black rounded-sm overflow-hidden flex items-center justify-center p-4">
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
                    <h3 className="font-heading text-xl sm:text-2xl text-black dark:text-white mb-3">{product.name}</h3>
                    
                    {/* Prix avec barré */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl font-bold font-sans text-[#39ff14]">{product.price}</span>
                      {product.oldPrice && (
                        <span className="text-base font-bold font-sans text-[#ef4444] line-through">{product.oldPrice}</span>
                      )}
                    </div>

                    <button 
                      onClick={() => addToCart(product)}
                      className="mt-auto w-full bg-[#ef4444] text-white font-heading text-lg py-3 flex items-center justify-center gap-2 uppercase hover:bg-[#dc2626] transition-colors active:scale-95"
                    >
                      <ShoppingCart size={20} />
                      Profiter de l'offre
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center">
                <Percent size={40} className="text-[#555]" />
              </div>
              <p className="text-2xl font-heading text-[#a1a1aa] uppercase mb-2">Aucune promotion en cours</p>
              <p className="text-[#555] font-sans">Revenez bientôt, de nouvelles offres arrivent régulièrement !</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
