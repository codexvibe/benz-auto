"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Search, Filter, Calendar, Gauge, MapPin, Info } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useDeferredValue } from "react";
import { createClient } from "../../utils/supabase/client";
import { useCompare } from "../../context/CompareContext";
import { ComparisonBar } from "../../components/ComparisonBar";
import { GitCompare } from "lucide-react";

export default function CarsPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm); // non-blocking search
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const supabase = createClient();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();

  useEffect(() => {
    async function fetchVehicles() {
      const { data } = await supabase
        .from("products")
        .select("id, name, year, mileage, price, image_url, location, category, status, is_featured, is_visible")
        .eq("is_visible", true);
      if (data) setVehicles(data);
      setLoading(false);
    }
    fetchVehicles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const categories = ["Tous", "SUV", "Sportive", "Berline", "Luxe"];

  // Mock data as fallback
  const displayVehicles = vehicles.length > 0 ? vehicles : [
    {
      id: 1,
      name: "Mercedes-Benz G63 AMG",
      year: "2023",
      mileage: "12,000 km",
      price: "Sur demande",
      image_url: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=800&auto=format&fit=crop",
      location: "Alger",
      category: "SUV",
    },
    {
      id: 2,
      name: "Porsche 911 GT3 RS",
      year: "2024",
      mileage: "1,500 km",
      price: "Sur demande",
      image_url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop",
      location: "Oran",
      category: "Sportive",
    }
  ];

  const filteredCars = displayVehicles.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(deferredSearch.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || car.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      
      <main className="pt-32 pb-32">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="mb-16 text-center animate-slide-up">
            <span className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">
              Catalogue
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tighter">
              VÉHICULES <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500">EN VENTE</span>
            </h1>
            <p className="text-slate-400 font-light max-w-2xl mx-auto">
              Découvrez notre sélection exclusive. Nous créons des vidéos professionnelles pour vendre les véhicules au meilleur prix. Contactez-nous pour acheter.
            </p>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="md:col-span-2 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher une marque, un modèle..."
                className="w-full bg-surface border border-white/10 rounded-full py-4 pl-16 pr-6 text-sm text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative md:col-span-2 lg:col-span-1">
              <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <select 
                className="w-full bg-surface border border-white/10 rounded-full py-4 pl-16 pr-6 text-sm text-white focus:outline-none focus:border-white/50 transition-all appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-surface">{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCars.map((car, index) => (
              <Link 
                href={`/cars/${car.id}`}
                key={car.id} 
                className="group relative rounded-3xl overflow-hidden border border-white/5 bg-surface transition-all duration-700 hover:border-white/20 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)] flex flex-col h-full animate-slide-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="relative h-75 overflow-hidden">
                  <img 
                    src={car.image_url} 
                    alt={car.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/50 to-transparent"></div>
                  
                  <div className="absolute top-6 right-6 flex gap-2">
                    <div className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold tracking-widest text-white uppercase border border-white/10">
                      {car.category}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (isInCompare(car.id)) {
                          removeFromCompare(car.id);
                        } else {
                          addToCompare(car);
                        }
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isInCompare(car.id) 
                          ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                          : "bg-black/60 text-white hover:bg-white hover:text-black"
                      } border border-white/10`}
                      title="Comparer"
                    >
                      <GitCompare className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-8 flex flex-col grow relative z-10 -mt-10">
                  <h3 className="text-2xl font-bold text-white mb-6 leading-tight group-hover:text-glow-chrome transition-all duration-500">
                    {car.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-8">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-widest">
                      <Calendar className="w-4 h-4 text-white" />
                      <span>{car.year}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-widest">
                      <Gauge className="w-4 h-4 text-white" />
                      <span>{car.mileage}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-widest col-span-2">
                      <MapPin className="w-4 h-4 text-white" />
                      <span>{car.location}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between group-hover:border-white/30 transition-colors duration-500">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] block mb-1">Tarif</span>
                      <span className="text-xl font-black text-white group-hover:text-glow-chrome transition-all duration-500">{car.price}</span>
                    </div>
                    
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                      <Info className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="py-32 text-center animate-fade-in">
              <p className="text-slate-500 text-lg font-light">Aucun véhicule ne correspond à votre recherche.</p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("Tous"); }}
                className="mt-6 px-6 py-2 border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </main>

      <ComparisonBar />
      <Footer />
    </div>
  );
}
