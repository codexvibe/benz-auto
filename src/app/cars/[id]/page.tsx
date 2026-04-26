"use client";

import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { 
  Calendar, 
  Gauge, 
  MapPin, 
  ChevronLeft, 
  Share2, 
  Heart, 
  MessageCircle, 
  Phone,
  ShieldCheck,
  Zap,
  Fuel
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

// Mock data (matches the listing page)
const cars = [
  {
    id: 1,
    name: "Mercedes-Benz G63 AMG",
    year: "2023",
    mileage: "12,000 km",
    price: "Sur demande",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop",
    location: "Showroom Alger",
    category: "SUV",
    description: "Le Mercedes-Benz G63 AMG est l'icône ultime du luxe tout-terrain. Ce véhicule allie des performances spectaculaires à un confort inégalé et une présence imposante sur la route.",
    engine: "V8 Biturbo 4.0L",
    power: "585 ch",
    transmission: "Automatique 9G-TRONIC",
    fuel: "Essence",
  },
  {
    id: 2,
    name: "Porsche 911 GT3 RS",
    year: "2024",
    mileage: "1,500 km",
    price: "Sur demande",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
    location: "Showroom Oran",
    category: "Sportive",
    description: "La Porsche 911 GT3 RS est conçue pour la performance pure sur circuit tout en restant homologuée pour la route. Aérodynamisme de pointe et moteur atmosphérique de légende.",
    engine: "Flat-6 4.0L",
    power: "525 ch",
    transmission: "PDK 7 rapports",
    fuel: "Essence",
  }
  // ... rest would be fetched from Supabase
];

import { createClient } from "../../../utils/supabase/client";

export default function CarDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCar() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      
      if (data) setCar(data);
      setLoading(false);
    }
    fetchCar();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center">Chargement...</div>;
  if (!car) return <div className="min-h-screen bg-black flex items-center justify-center">Véhicule non trouvé</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-24">
        {/* Navigation & Actions */}
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/cars" className="flex items-center gap-2 text-gray-400 hover:text-[#ff0000] transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Retour au stock</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full glass-dark border border-white/10 hover:border-white/30 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full glass-dark border transition-all ${isLiked ? "border-[#ff0000] bg-[#ff0000]/10 text-[#ff0000]" : "border-white/10 text-white"}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Hero Gallery */}
        <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${car.image_url})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <div className="absolute bottom-12 left-0 w-full">
            <div className="container mx-auto px-6">
              <div className="inline-block px-4 py-1 bg-[#ff0000] text-white text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
                {car.category}
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-2">
                {car.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#ff0000]" />
                  <span>{car.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-[#ff0000]" />
                  <span>{car.mileage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#ff0000]" />
                  <span>{car.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Info & Specs */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-[#ff0000] rounded-full"></span>
                  Description
                </h2>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {car.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-[#ff0000] rounded-full"></span>
                  Spécifications Techniques
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-dark p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ff0000]/10 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#ff0000]" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Moteur</span>
                      <p className="font-bold text-white">{car.engine}</p>
                    </div>
                  </div>
                  <div className="glass-dark p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ff0000]/10 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-[#ff0000]" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Puissance</span>
                      <p className="font-bold text-white">{car.power}</p>
                    </div>
                  </div>
                  <div className="glass-dark p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ff0000]/10 flex items-center justify-center">
                      <Fuel className="w-6 h-6 text-[#ff0000]" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Carburant</span>
                      <p className="font-bold text-white">{car.fuel}</p>
                    </div>
                  </div>
                  <div className="glass-dark p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ff0000]/10 flex items-center justify-center">
                      <Gauge className="w-6 h-6 text-[#ff0000]" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Boite</span>
                      <p className="font-bold text-white">{car.transmission}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: CTA & Price */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div className="mb-8">
                  <span className="text-gray-400 text-sm block mb-1 uppercase tracking-widest">Prix de vente</span>
                  <div className="text-4xl font-bold text-white">{car.price}</div>
                  <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Disponible immédiatement</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full py-4 bg-[#ff0000] text-white font-bold rounded-xl hover:bg-[#cc0000] transition-all flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Appeler le Showroom
                  </button>
                  <button className="w-full py-4 glass-panel border border-[#25d366]/50 text-white font-bold rounded-xl hover:bg-[#25d366]/10 transition-all flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5 text-[#25d366]" />
                    WhatsApp
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                  <p className="text-gray-500 text-sm">
                    Réf: #BA-{car.id}{car.year}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
