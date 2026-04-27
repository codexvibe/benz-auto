"use client";

import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { useCompare } from "../../../context/CompareContext";
import { X, GitCompare, Calendar, Gauge, MapPin, Tag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ComparePage() {
  const { selectedVehicles, removeFromCompare, clearCompare } = useCompare();

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      
      <main className="pt-32 pb-32">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-16 text-center">
            <span className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">
              Comparateur
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tighter">
              COMPARAISON <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500">DÉTAILLÉE</span>
            </h1>
            {selectedVehicles.length > 0 && (
              <button 
                onClick={clearCompare}
                className="text-xs text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Réinitialiser la sélection
              </button>
            )}
          </div>

          {selectedVehicles.length === 0 ? (
            <div className="py-32 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                <GitCompare className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 mb-8">Aucun véhicule sélectionné pour la comparaison.</p>
              <Link 
                href="/cars"
                className="px-8 py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
              >
                Retour au showroom
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {selectedVehicles.map((vehicle, index) => (
                <motion.div 
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group rounded-3xl overflow-hidden border border-white/10 bg-surface flex flex-col"
                >
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCompare(vehicle.id)}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={vehicle.image_url} 
                      alt={vehicle.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-surface to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col grow">
                    <div className="mb-8">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">{vehicle.category}</div>
                      <h3 className="text-2xl font-bold mb-2">{vehicle.name}</h3>
                      <div className="text-xl font-black text-white">{vehicle.price}</div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <Calendar className="w-4 h-4" />
                          Année
                        </div>
                        <div className="font-bold">{vehicle.year}</div>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <Gauge className="w-4 h-4" />
                          Kilométrage
                        </div>
                        <div className="font-bold">{vehicle.mileage}</div>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <MapPin className="w-4 h-4" />
                          Localisation
                        </div>
                        <div className="font-bold">{vehicle.location}</div>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <Tag className="w-4 h-4" />
                          Statut
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold">DISPONIBLE</div>
                      </div>
                    </div>

                    <div className="mt-12">
                      <Link 
                        href={`/cars/${vehicle.id}`}
                        className="w-full py-4 rounded-2xl border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center"
                      >
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}

              {selectedVehicles.length < 3 && (
                <Link 
                  href="/cars"
                  className="rounded-3xl border-2 border-dashed border-white/10 bg-white/2 flex flex-col items-center justify-center p-12 hover:bg-white/5 hover:border-white/20 transition-all group min-h-[500px]"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <X className="w-6 h-6 text-slate-500 rotate-45" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Ajouter un véhicule</div>
                  <div className="text-white font-bold">Compléter la comparaison</div>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
