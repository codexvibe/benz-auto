"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Search, Filter, Calendar, Gauge, MapPin, Info } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const cars = [
  {
    id: 1,
    name: "Mercedes-Benz G63 AMG",
    year: "2023",
    mileage: "12,000 km",
    price: "Sur demande",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=800&auto=format&fit=crop",
    location: "Showroom Alger",
    category: "SUV",
  },
  {
    id: 2,
    name: "Porsche 911 GT3 RS",
    year: "2024",
    mileage: "1,500 km",
    price: "Sur demande",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop",
    location: "Showroom Oran",
    category: "Sportive",
  },
  {
    id: 3,
    name: "Audi RS Q8",
    year: "2022",
    mileage: "35,000 km",
    price: "Sur demande",
    image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800&auto=format&fit=crop",
    location: "Showroom Alger",
    category: "SUV",
  },
  {
    id: 4,
    name: "Range Rover Sport SV",
    year: "2024",
    mileage: "0 km (Neuf)",
    price: "Sur demande",
    image: "https://images.unsplash.com/photo-1606016159991-cdf4a33237f6?q=80&w=800&auto=format&fit=crop",
    location: "Showroom Alger",
    category: "SUV",
  },
  {
    id: 5,
    name: "BMW M5 Competition",
    year: "2023",
    mileage: "8,500 km",
    price: "Sur demande",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
    location: "Showroom Constantine",
    category: "Berline",
  },
  {
    id: 6,
    name: "Lamborghini Urus S",
    year: "2024",
    mileage: "500 km",
    price: "Sur demande",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format&fit=crop",
    location: "Showroom Alger",
    category: "SUV",
  }
];

import { createClient } from "../../utils/supabase/client";

export default function CarsPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const supabase = createClient();

  useEffect(() => {
    async function fetchVehicles() {
      const { data } = await supabase
        .from("products")
        .select("*");
      if (data) setVehicles(data);
      setLoading(false);
    }
    fetchVehicles();
  }, []);

  const categories = ["Tous", "SUV", "Sportive", "Berline", "Luxe"];

  const filteredCars = vehicles.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || car.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
              NOTRE <span className="text-[#ff0000]">STOCK</span>
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Explorez notre inventaire exclusif de véhicules premium. Chaque véhicule est inspecté et certifié.
            </p>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Rechercher une marque, un modèle..."
                className="w-full bg-[#111] border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <select 
                className="w-full bg-[#111] border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#ff0000] transition-all appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div 
                key={car.id} 
                className="group glass-dark rounded-2xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-glow-red-hover hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden bg-[#111]">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${car.image_url})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10">
                    {car.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#ff0000] transition-colors">
                    {car.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4 text-[#ff0000]" />
                      <span>{car.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Gauge className="w-4 h-4 text-[#ff0000]" />
                      <span>{car.mileage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 col-span-2">
                      <MapPin className="w-4 h-4 text-white/50" />
                      <span>{car.location}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Prix de vente</span>
                      <span className="text-xl font-bold text-white">{car.price}</span>
                    </div>
                    
                    <Link 
                      href={`/cars/${car.id}`}
                      className="px-6 py-2.5 bg-[#ff0000] text-white text-sm font-bold rounded-lg hover:bg-[#cc0000] transition-all duration-300"
                    >
                      Détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-500 text-lg">Aucun véhicule ne correspond à votre recherche.</p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("Tous"); }}
                className="mt-4 text-[#ff0000] hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
