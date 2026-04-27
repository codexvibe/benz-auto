"use client";

import { useCompare } from "../context/CompareContext";
import { X, ArrowRight, GitCompare } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function ComparisonBar() {
  const { selectedVehicles, removeFromCompare, clearCompare } = useCompare();

  if (selectedVehicles.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl"
      >
        <div className="glass-dark border border-white/10 rounded-[32px] p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-6">
            <div className="hidden md:flex w-12 h-12 rounded-2xl bg-white/5 items-center justify-center border border-white/10">
              <GitCompare className="w-5 h-5 text-white" />
            </div>
            <div className="flex -space-x-3 overflow-hidden">
              {selectedVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="relative group w-14 h-14 rounded-xl border-2 border-background overflow-hidden"
                >
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFromCompare(vehicle.id)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              {Array.from({ length: 3 - selectedVehicles.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-14 h-14 rounded-xl border-2 border-dashed border-white/10 bg-white/5"
                ></div>
              ))}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold uppercase tracking-widest text-white">
                {selectedVehicles.length} véhicule{selectedVehicles.length > 1 ? "s" : ""} sélectionné{selectedVehicles.length > 1 ? "s" : ""}
              </div>
              <button
                onClick={clearCompare}
                className="text-[10px] text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Tout effacer
              </button>
            </div>
          </div>

          <Link
            href="/cars/compare"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all group"
          >
            Comparer
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
