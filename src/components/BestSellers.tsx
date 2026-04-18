"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';
import { useCart } from '../context/CartContext';

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
  { id: 4, name: 'VELO FREEZE MAX', category: 'Snus', price: '1 000 DZD', oldPrice: null, image: '/assets/snus_pablo.png', badge: 'DISCRET', badgeColor: 'bg-white text-black border', glowColor: 'box-glow-green-hover' }
];

export const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [selectedFlavors, setSelectedFlavors] = useState<Record<number, string>>({});
  const { addToCart } = useCart();

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
          .eq('is_visible', true)
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
            glowColor: item.glow_color,
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

  return (
    <section className="py-20 bg-gray-50 dark:bg-black relative" id="shop">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black/10 dark:border-[#0f0f0f] pb-6">
          <div>
            <h2 className="text-5xl md:text-7xl font-heading text-black dark:text-white mb-2 uppercase">
              NOS MEILLEURES <span className="text-[#ef4444]">VENTES</span>
            </h2>
            <p className="text-[#a1a1aa] text-lg font-sans">Les références les plus demandées en Algérie. Quantité limitée.</p>
          </div>
          <Link 
            href="/shop" 
            className="hidden md:inline-block text-[#39ff14] hover:text-black dark:hover:text-white font-heading text-xl uppercase transition-colors tracking-widest underline underline-offset-8 mt-4"
          >
            VOIR TOUT LE STOCK ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={product.id}
              className={`bg-white dark:bg-[#0f0f0f] border border-black/5 dark:border-white/5 p-4 flex flex-col group transition-all duration-500 hover:-translate-y-3 hover:shadow-xl ${product.glowColor} relative`}
              onClick={() => {
                import('../app/admin/actions').then(m => m.incrementProductViewAction(product.id));
              }}
            >
              <div className={`absolute top-4 left-4 z-10 ${product.badgeColor} px-4 py-1.5 font-heading text-sm md:text-base tracking-wider uppercase shadow-md`}>
                {product.badge}
              </div>

              <div className="h-64 w-full relative mb-6 bg-gray-100 dark:bg-black rounded-sm flex items-center justify-center p-4">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  width={200}
                  height={200}
                  className="max-h-full object-contain group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3 drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-500 ease-out will-change-transform"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2 mt-4 relative z-10">
                  <span className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest">{product.category}</span>
                  {product.badge && (
                    <span className={`px-2.5 py-1 ${product.badgeColor} text-white font-heading text-xs tracking-wider uppercase shadow-sm`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                
                <Link href={`/product/${product.id}`} className="block group/link">
                  <h3 className="font-heading text-xl text-black dark:text-white mb-2 uppercase group-hover/link:text-[#39ff14] transition-colors">{product.name}</h3>
                </Link>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold font-sans text-[#39ff14]">{product.price}</span>
                  {product.oldPrice && (
                    <span className="text-sm font-bold font-sans text-[#ef4444] line-through">
                      {product.oldPrice}
                    </span>
                  )}
                </div>
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
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/shop" 
            className="inline-block text-[#39ff14] hover:text-black dark:hover:text-white font-heading text-xl uppercase transition-colors tracking-widest underline underline-offset-8"
          >
            VOIR TOUT LE STOCK ➔
          </Link>
        </div>
      </div>
    </section>
  );
};
