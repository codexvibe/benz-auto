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
    <section id="showroom" className="py-24 relative bg-[#0a0a0a]">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-[#ff0000]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            SHOWROOM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0000] to-white">PREMIUM</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Une sélection rigoureuse des véhicules les plus exclusifs disponibles sur le marché algérien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {displayVehicles.map((car) => (
            <div 
              key={car.id} 
              className="group glass-dark rounded-2xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-glow-red-hover hover:-translate-y-2 flex flex-col h-full"
            >
              {/* Car Image Area */}
              <div className="relative h-56 overflow-hidden bg-[#111]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${car.image_url || car.image})` }}
                ></div>
                
                {car.status && car.status !== "Disponible" && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10 z-10">
                    {car.status}
                  </div>
                )}

                {car.is_featured && (
                  <div className="absolute top-4 right-4 p-1.5 bg-[#ff0000] text-white rounded-lg shadow-lg z-10">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                {car.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#ff0000]/80 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                    En Vedette
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#ff0000] transition-colors line-clamp-1">
                    {car.name}
                  </h3>
                </div>
              </div>

              {/* Car Details Area */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar className="w-4 h-4 text-[#ff0000]" />
                    <span>{car.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Gauge className="w-4 h-4 text-[#ff0000]" />
                    <span>{car.mileage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300 col-span-2">
                    <MapPin className="w-4 h-4 text-white/50" />
                    <span>{car.location}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Prix</span>
                    <span className="font-bold text-white">{car.price}</span>
                  </div>
                  
                  <Link 
                    href={`/cars/${car.id}`}
                    className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/10 group-hover:border-[#ff0000] group-hover:bg-[#ff0000]/20 transition-all duration-300"
                  >
                    <Info className="w-5 h-5 text-white group-hover:text-[#ff0000]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/cars"
            className="inline-block px-8 py-4 glass-dark text-white border border-[#ff0000]/50 rounded-lg hover:bg-[#ff0000]/10 hover:border-[#ff0000] hover:box-glow-red transition-all duration-300 font-medium"
          >
            Voir tout le stock
          </Link>
        </div>
      </div>
    </section>
  );
}
