"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldAlert, BadgeDollarSign, Archive } from 'lucide-react';

const features = [
  {
    icon: <Truck size={40} />,
    title: 'LIVRAISON 58 WILAYAS',
    desc: 'Rapide, sécurisée et discrète partout en Algérie. Paiement à la livraison disponible.',
    color: 'text-[#39ff14]'
  },
  {
    icon: <ShieldAlert size={40} />,
    title: 'CONTREFAÇON ❌',
    desc: 'Nous garantissons l\'authenticité de tous nos produits. Korda = ZERO.',
    color: 'text-[#ef4444]'
  },
  {
    icon: <BadgeDollarSign size={40} />,
    title: 'PRIX IMBATTABLES',
    desc: 'N°1 sur le marché des snus et vapes. Testez et comparez.',
    color: 'text-[#facc15]'
  },
  {
    icon: <Archive size={40} />,
    title: 'GROS & DÉTAIL',
    desc: 'Des tarifs dégressifs spécialement conçus pour les revendeurs (Cartouches/Vrac).',
    color: 'text-[#ff00ff]'
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-white dark:bg-[#0f0f0f] relative border-y border-black/5 dark:border-white/5">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-heading text-black dark:text-white uppercase">
            POURQUOI CHOISIR <span className="text-[#39ff14]">HM.ZONEDZ ?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={index}
              className="bg-gray-50 dark:bg-black border border-black/10 dark:border-white/10 p-8 flex flex-col items-center text-center hover:border-black/30 dark:hover:border-white/30 transition-colors group"
            >
              <div className={`mb-6 p-4 rounded-full bg-white dark:bg-[#0f0f0f] border border-black/5 dark:border-transparent ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="font-heading text-2xl text-black dark:text-white mb-4 uppercase">{item.title}</h3>
              <p className="text-[#a1a1aa] font-sans">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
