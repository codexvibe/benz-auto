"use client";

import { Info, Calendar, Gauge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

const FALLBACK = [
  {
    id: 1,
    name: "Mercedes-Benz G63 AMG",
    year: "2023",
    mileage: "12,000 km",
    price: "Sur demande",
    image_url: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=800&auto=format&fit=crop",
    location: "Showroom Alger",
    is_featured: true,
    status: "Disponible",
    category: "SUV",
  },
];

export function PremiumShowroom() {
  const [vehicles, setVehicles] = useState<typeof FALLBACK>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchVehicles() {
      // Select only columns needed for the card — avoids transferring heavy description fields
      const { data } = await supabase
        .from("products")
        .select("id, name, year, mileage, price, image_url, location, is_featured, status, category")
        .eq("is_visible", true)
        .order("is_featured", { ascending: false })
        .limit(4);
      if (data && data.length > 0) setVehicles(data as typeof FALLBACK);
      setLoading(false);
    }
    fetchVehicles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayVehicles = vehicles.length > 0 ? vehicles : FALLBACK;

  return (
    <section id="showroom" className="py-32 relative bg-background">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/2 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-slide-up">
          <span className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">
            Collection Exclusive
          </span>
          <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 tracking-tighter">
            VÉHICULES{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-b from-white via-brand-red to-brand-red-dark">
              EN VENTE
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[450px] rounded-3xl bg-white/2 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {displayVehicles.map((car, index) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group relative h-[450px] rounded-3xl overflow-hidden border border-white/5 transition-all duration-700 hover:border-white/20 hover:-translate-y-4 shadow-2xl block animate-slide-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                {/* Optimized image with lazy loading (only first is eager) */}
                <img 
                  src={car.image_url} 
                  alt={car.name}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop";
                  }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Top Badges */}
                <div className="absolute top-6 w-full px-6 flex justify-between items-center z-10">
                  {car.is_featured ? (
                    <div className="px-4 py-1.5 bg-brand-red backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-white uppercase border border-brand-red shadow-[0_0_20px_rgba(230,0,0,0.4)]">
                      En Vedette
                    </div>
                  ) : <div />}
                  {car.status && car.status !== "Disponible" && (
                    <div className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                      {car.status}
                    </div>
                  )}
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-10 flex flex-col justify-end h-full">
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-glow-red transition-all duration-500 line-clamp-2">
                    {car.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-medium tracking-wider text-slate-300 mb-6 uppercase">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {car.year}</span>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" /> {car.mileage}</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between group-hover:border-white/30 transition-colors duration-500">
                    <span className="font-bold text-lg text-white group-hover:text-glow-chrome transition-all duration-500">
                      {car.price}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-brand-red group-hover:border-brand-red group-hover:text-white transition-all duration-500">
                      <Info className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-24 text-center">
          <Link
            href="/cars"
            className="inline-block px-12 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white border border-white/20 rounded-full hover:bg-brand-red hover:border-brand-red transition-all duration-500"
          >
            Voir tous les véhicules en vente
          </Link>
        </div>
      </div>
    </section>
  );
}
