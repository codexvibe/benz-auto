"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

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
  {
    id: 1,
    name: 'PABLO ICE COLD',
    category: 'Snus / Nicotine Pouches',
    price: '1 200 DZD',
    oldPrice: '1 500 DZD',
    image: '/assets/snus_pablo.png',
    badge: 'TOP VENTE 🔥',
    badgeColor: 'bg-[#ef4444]',
    glowColor: 'box-glow-green-hover',
  },
  {
    id: 2,
    name: 'TORNADO 9000 PRO',
    category: 'Vape Jetable',
    price: '3 500 DZD',
    oldPrice: '4 200 DZD',
    image: '/assets/vape_tornado.png',
    badge: 'NOUVEAU ⚡',
    badgeColor: 'bg-[#facc15] text-black',
    glowColor: 'hover:shadow-[0_0_25px_rgba(250,204,21,0.6)]',
  },
  {
    id: 3,
    name: 'KILLA COLD MINT',
    category: 'Snus / Nicotine Pouches',
    price: '1 100 DZD',
    oldPrice: null,
    image: '/assets/snus_pablo.png',
    badge: 'FORT 💪',
    badgeColor: 'bg-[#ff00ff]',
    glowColor: 'hover:shadow-[0_0_25px_rgba(255,0,255,0.6)]',
  },
  {
    id: 4,
    name: 'JNR ALIEN 10K',
    category: 'Vape Jetable',
    price: '4 000 DZD',
    oldPrice: '4 500 DZD',
    image: '/assets/vape_tornado.png',
    badge: 'PROMO 🎁',
    badgeColor: 'bg-[#39ff14] text-black',
    glowColor: 'box-glow-green-hover',
  }
];

export const BestSellers = () => {
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
          .select('*')
          .limit(4);
          
        if (data && data.length > 0) {
          // On map les données Supabase vers notre format frontend
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

  return (
    <section className="py-20 bg-black relative" id="shop">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#0f0f0f] pb-6">
          <div>
            <h2 className="text-5xl md:text-7xl font-heading text-white mb-2 uppercase">
              NOS MEILLEURES <span className="text-[#ef4444]">VENTES</span>
            </h2>
            <p className="text-[#a1a1aa] text-lg font-sans">Les références les plus demandées en Algérie. Quantité limitée.</p>
          </div>
          <a href="#" className="hidden md:inline-block text-[#39ff14] hover:text-white font-heading text-xl uppercase transition-colors tracking-widest underline underline-offset-8 mt-4">
            VOIR TOUT LE STOCK ➔
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={product.id}
              className={`bg-[#0f0f0f] border border-white/5 p-4 flex flex-col group transition-all duration-300 ${product.glowColor} relative overflow-hidden`}
            >
              <div className={`absolute top-4 left-4 z-10 ${product.badgeColor} px-3 py-1 font-heading text-sm tracking-wider uppercase`}>
                {product.badge}
              </div>

              <div className="h-64 w-full relative mb-6 bg-black rounded-sm overflow-hidden flex items-center justify-center p-4">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  width={200}
                  height={200}
                  className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 will-change-transform"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <span className="text-xs text-[#a1a1aa] font-bold tracking-widest uppercase mb-1">{product.category}</span>
                <h3 className="font-heading text-2xl text-white mb-2">{product.name}</h3>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-bold font-sans text-[#39ff14]">{product.price}</span>
                  {product.oldPrice && (
                    <span className="text-sm font-bold font-sans text-[#a1a1aa] line-through">{product.oldPrice}</span>
                  )}
                </div>

                <button className="mt-auto w-full bg-white text-black font-heading text-lg py-3 flex items-center justify-center gap-2 uppercase hover:bg-[#39ff14] transition-colors">
                  <ShoppingCart size={20} />
                  Ajouter au panier
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <a href="#" className="inline-block text-[#39ff14] hover:text-white font-heading text-xl uppercase transition-colors tracking-widest underline underline-offset-8">
            VOIR TOUT LE STOCK ➔
          </a>
        </div>
      </div>
    </section>
  );
};
