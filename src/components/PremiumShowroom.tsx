"use client";

import { Info, MapPin, Calendar, Gauge, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

export function PremiumShowroom() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchVehicles() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_visible", true)
        .order("is_featured", { ascending: false })
        .limit(4);
      if (data) setVehicles(data);
      setLoading(false);
    }
    fetchVehicles();
  }, []);

  // Use static data as fallback if DB is empty
  const displayVehicles = vehicles.length > 0 ? vehicles : [
    {
      id: 1,
      name: "Mercedes-Benz G63 AMG",
      year: "2023",
      mileage: "12,000 km",
      price: "Sur demande",
      image_url: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=800&auto=format&fit=crop",
      location: "Showroom Alger",
      featured: true,
    }
  ];

  return (
    <section id="showroom" className="py-32 relative bg-background">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-200 h-200 bg-white/2 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-slide-up">
          <span className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">
            Collection Exclusive
          </span>
          <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 tracking-tighter">
            VÉHICULES <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500">EN VENTE</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {displayVehicles.map((car, index) => (
            <Link 
              key={car.id}
              href={`/cars/${car.id}`}
              className="group relative h-112.5 rounded-3xl overflow-hidden border border-white/5 transition-all duration-700 hover:border-white/20 hover:-translate-y-4 shadow-2xl block animate-slide-up"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                style={{ backgroundImage: `url(${car.image_url || car.image})` }}
              ></div>
              
              {/* Gradient Overlay for Text */}
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Top Badges */}
              <div className="absolute top-6 w-full px-6 flex justify-between items-center z-10">
                {car.is_featured || car.featured ? (
                  <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-white uppercase border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    En Vedette
                  </div>
                ) : <div></div>}
                
                {car.status && car.status !== "Disponible" && (
                  <div className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                    {car.status}
                  </div>
                )}
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-0 left-0 w-full p-8 z-10 flex flex-col justify-end h-full">
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-glow-chrome transition-all duration-500 line-clamp-2">
                  {car.name}
                </h3>

                <div className="flex items-center gap-4 text-xs font-medium tracking-wider text-slate-300 mb-6 uppercase">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {car.year}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30"></span>
                  <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" /> {car.mileage}</span>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between group-hover:border-white/30 transition-colors duration-500">
                  <div>
                    <span className="font-bold text-lg text-white group-hover:text-glow-chrome transition-all duration-500">{car.price}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <Info className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link
            href="/cars"
            className="inline-block px-12 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white border border-white/20 rounded-full hover:bg-white hover:text-black hover:box-glow-chrome transition-all duration-500"
          >
            Voir tous les véhicules en vente
          </Link>
        </div>
      </div>
    </section>
  );
}
