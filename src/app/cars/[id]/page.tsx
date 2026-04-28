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
  Fuel,
  ImageIcon,
  X
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
    location: "Alger",
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
    location: "Oran",
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Chargement...</div>;
  if (!car) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Véhicule non trouvé</div>;

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      
      <main className="pt-24">
        {/* Navigation & Actions */}
        <div className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10 animate-fade-in">
          <Link href="/cars" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-widest font-bold">Retour au catalogue</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-white/50 hover:bg-white hover:text-black transition-all duration-300">
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isLiked ? "border-white bg-white text-black box-glow-chrome" : "bg-white/5 border-white/10 text-white hover:border-white/50 hover:bg-white hover:text-black"}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Hero Gallery */}
        <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden -mt-25 z-0 animate-scale-in">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{ backgroundImage: `url(${car.image_url})` }}
          ></div>
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-background/30"></div>
          
          <div className="absolute bottom-12 left-0 w-full z-10">
            <div className="container mx-auto px-6 animate-slide-up">
              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold rounded-lg mb-6 uppercase tracking-[0.2em]">
                {car.category}
              </div>
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-heading font-black text-white mb-6 tracking-tighter leading-none">
                {car.name}
              </h1>
              <div className="flex flex-wrap items-center gap-8 text-slate-300 text-sm uppercase tracking-widest font-bold">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-white" />
                  <span>{car.year}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/50"></div>
                <div className="flex items-center gap-3">
                  <Gauge className="w-4 h-4 text-white" />
                  <span>{car.mileage}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/50"></div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-white" />
                  <span>{car.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-6 py-20 relative z-20">
          
          {/* Galerie Photos (Si disponible) */}
          {car.images && car.images.length > 0 && (
            <div className="mb-20 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-sm font-bold mb-8 uppercase tracking-[0.3em] text-slate-400 border-b border-white/10 pb-4 flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-white" /> Galerie Photos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {car.images.map((img: string, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedImage(img)}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:box-glow-chrome cursor-zoom-in"
                  >
                    <img 
                      src={img} 
                      alt={`${car.name} - Photo ${idx + 1}`} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Column: Info & Specs */}
            <div className="lg:col-span-2 space-y-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div>
                <h2 className="text-sm font-bold mb-8 uppercase tracking-[0.3em] text-slate-400 border-b border-white/10 pb-4">
                  Description
                </h2>
                <p className="text-slate-300 leading-relaxed text-lg font-light">
                  {car.description}
                </p>
              </div>

              <div>
                <h2 className="text-sm font-bold mb-8 uppercase tracking-[0.3em] text-slate-400 border-b border-white/10 pb-4">
                  Spécifications Techniques
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface p-6 rounded-2xl border border-white/5 flex items-center gap-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Moteur</span>
                      <p className="font-bold text-white text-lg">{car.engine}</p>
                    </div>
                  </div>
                  <div className="bg-surface p-6 rounded-2xl border border-white/5 flex items-center gap-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Puissance</span>
                      <p className="font-bold text-white text-lg">{car.power}</p>
                    </div>
                  </div>
                  <div className="bg-surface p-6 rounded-2xl border border-white/5 flex items-center gap-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Fuel className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Carburant</span>
                      <p className="font-bold text-white text-lg">{car.fuel}</p>
                    </div>
                  </div>
                  <div className="bg-surface p-6 rounded-2xl border border-white/5 flex items-center gap-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Gauge className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Boîte</span>
                      <p className="font-bold text-white text-lg">{car.transmission}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: CTA & Price */}
            <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="sticky top-32 bg-surface p-10 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(255,255,255,0.02)]">
                <div className="mb-10 text-center">
                  <span className="text-slate-400 text-[10px] block mb-2 uppercase tracking-[0.3em] font-bold">Tarif</span>
                  <div className="text-4xl font-black text-white">{car.price}</div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-white/70 text-xs uppercase tracking-widest font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Disponible pour achat</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <a href="tel:+213000000000" className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-200 transition-all duration-500 flex items-center justify-center gap-3 hover:box-glow-chrome">
                    <Phone className="w-4 h-4" />
                    Appeler
                  </a>
                  <a href="https://wa.me/213000000000" target="_blank" className="w-full py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-500 flex items-center justify-center gap-3">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                  <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                    Réf: #BA-{car.id}{car.year}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="max-w-6xl w-full max-h-[90vh] p-4 flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Grand format" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-scale-in"
            />
          </div>
        </div>
      )}
    </div>
  );
}
