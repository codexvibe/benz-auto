"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Save,
  Upload,
  X,
  Image as ImageIcon,
  Star,
  Loader2,
  Zap,
  Car,
  Plus,
  GripVertical,
  ChevronDown,
  Info,
  Layers,
  MapPin,
  Flame,
  CheckCircle2,
  Cpu,
  Globe,
  Activity,
  ShieldCheck,
  MousePointer2,
  Trash2,
  Search,
  MoreHorizontal
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";

const INITIAL_MODELS: Record<string, string[]> = {
  "Audi": ["A1", "A3", "A5", "A6", "A6 e-tron", "A8", "E-tron GT", "Q2", "Q3", "Q4 e-tron", "Q4 sportback e-tron", "Q5", "Q6 e-tron", "Q6 sportback e-tron", "Q7", "Q8"],
  "BMW": ["i4", "i5", "i7", "iX", "iX1", "iX2", "iX3", "Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "Série 7", "Série 8", "X1", "X2", "X3", "X5", "X6", "X7", "XM", "Z4"],
  "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe CLA", "Classe E", "Classe G", "Classe GLA", "Classe GLE", "Classe GLS", "Classe S", "Classe T", "Classe V", "CLE", "EQA", "EQB", "EQE", "EQS", "EQT", "EQV", "GLB", "GLC", "GT AMG", "SL", "Vito"],
  "Volkswagen": ["Caddy", "Golf", "Id.3", "Id.4", "Id.5", "Id.7", "Id.Buzz", "Multivan", "Passat", "Polo", "T-cross", "T-roc", "Taigo", "Tayron", "Tiguan", "Touran"],
  "Toyota": ["Aygo X", "BZ4X", "C-HR", "Corolla", "Corolla cross", "Highlander", "Land cruiser 250", "Mirai", "Prius", "Proace city verso", "Proace verso", "RAV4", "Supra", "Urban Cruiser", "Yaris", "Yaris Cross"],
  "Renault": ["4", "5", "Arkana", "Austral", "Captur", "Clio", "Espace", "Grand Kangoo", "Kangoo", "Megane e-tech", "Rafale", "Scenic", "Symbioz", "Trafic", "Twingo"],
  "Peugeot": ["2008", "208", "3008", "308", "408", "5008", "508", "Partner", "Rifter", "Traveller"],
  "Ford": ["Bronco", "Capri", "Explorer EV", "Focus", "Kuga", "Mustang", "Mustang Mach-e", "Puma", "Tourneo", "Tourneo Custom"],
  "Hyundai": ["Bayon", "i10", "i20", "i30", "Inster", "Ioniq 5", "Ioniq 6", "Ioniq 9", "Kona", "Santa Fe", "Staria", "Tucson"],
  "KIA": ["Ceed", "EV2", "EV3", "EV4", "EV5", "EV6", "EV9", "K4", "Niro", "Picanto", "PV5", "Sorento", "Sportage", "Stonic", "XCeed"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
  "Volvo": ["EC40", "ES90", "EX30", "EX40", "EX60", "EX90", "V60", "XC40", "XC60", "XC90"],
  "Nissan": ["Ariya", "Juke", "Leaf", "Micra", "Qashqai", "Townstar", "X-TRAIL"],
  "Opel": ["Astra", "Combo", "Corsa", "Frontera", "Grandland", "Mokka", "Zafira"],
  "Fiat": ["500", "600", "Doblo", "Grande Panda", "Pandina", "Qubo L", "Topolino"]
};

const INITIAL_BRANDS: string[] = Object.keys(INITIAL_MODELS).sort();

const CATEGORIES = [
  { value: "SUV", label: "SUV" },
  { value: "4x4 / Pick-up", label: "4x4 / Pick-up" },
  { value: "Sportive", label: "Sportive" },
  { value: "Berline", label: "Berline" },
  { value: "Luxe", label: "Luxe" },
  { value: "Utilitaire", label: "Utilitaire" },
  { value: "Compacte", label: "Compacte" },
  { value: "Coupé", label: "Coupé" },
  { value: "Cabriolet", label: "Cabriolet" },
  { value: "Break", label: "Break" },
  { value: "Monospace", label: "Monospace" },
];

function CustomSelect({ options, value, onChange, placeholder, icon: Icon }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((o: any) => {
    const label = typeof o === 'string' ? o : o.label;
    return label.toLowerCase().includes(search.toLowerCase());
  });

  const selectedLabel = typeof options[0] === 'string' 
    ? value 
    : options.find((o: any) => o.value === value)?.label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 flex items-center justify-between text-sm font-black text-white shadow-inner hover:border-white/20 transition-all group"
      >
        <div className="flex items-center gap-4 min-w-0">
           {Icon && <Icon className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors shrink-0" />}
           <span className={`truncate ${value ? "text-white" : "text-slate-700 italic"}`}>{selectedLabel || placeholder}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-700 transition-transform duration-500 shrink-0 ${isOpen ? "rotate-180 text-white" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] top-full mt-4 w-full bg-surface/95 backdrop-blur-3xl border border-white/10 rounded-4xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-6 border-b border-white/5 relative">
            <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              placeholder="Filtrer..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-white outline-none focus:border-white/20 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-80 overflow-y-auto custom-scrollbar p-3">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-[10px] font-black uppercase text-slate-700 tracking-widest">Aucun résultat</div>
            ) : (
              filtered.map((opt: any) => {
                const optValue = typeof opt === 'string' ? opt : opt.value;
                const optLabel = typeof opt === 'string' ? opt : opt.label;
                return (
                  <button
                    key={optValue}
                    type="button"
                    onClick={() => {
                      onChange(optValue);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all mb-1 ${
                      value === optValue 
                        ? "bg-white text-black shadow-lg scale-[1.02]" 
                        : "text-slate-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {optLabel}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface FormData {
  name: string;
  brand: string;
  category: string;
  price: string;
  image_url: string;
  description: string;
  year: string;
  mileage: string;
  location: string;
  engine: string;
  power: string;
  transmission: string;
  fuel: string;
  images: string[];
  is_visible: boolean;
  is_featured: boolean;
  status: string;
}

interface VehicleFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export function VehicleForm({ initialData, onSubmit, loading }: VehicleFormProps) {
  const supabase = createClient();

  const getInitialFormData = useCallback(() => {
    const base: FormData = {
      name: "",
      brand: "",
      category: "SUV",
      price: "",
      image_url: "",
      description: "",
      year: "",
      mileage: "",
      location: "Showroom Alger",
      engine: "",
      power: "",
      transmission: "Automatique",
      fuel: "Essence",
      images: [],
      is_visible: true,
      is_featured: false,
      status: "Disponible",
    };
    if (initialData) {
      return {
        ...base,
        ...initialData,
        images: Array.isArray(initialData.images) ? initialData.images : [],
        category: initialData.category || base.category,
      };
    }
    return base;
  }, [initialData]);

  const [formData, setFormData] = useState<FormData>(getInitialFormData);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [history, setHistory] = useState({
    brands: [] as string[],
    models: [] as string[],
    engines: [] as string[],
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev: FormData) => ({
        ...prev,
        ...initialData,
        images: Array.isArray(initialData.images) ? initialData.images : [],
        category: initialData.category || prev.category,
      }));
    }
  }, [initialData]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data: products } = await supabase.from("products").select("brand, name, engine");
    if (products) {
      const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
      const models = Array.from(new Set(products.map(p => p.name).filter(Boolean)));
      const engines = Array.from(new Set(products.map(p => p.engine).filter(Boolean)));
      setHistory({ brands, models, engines });
    }
  };

  const allBrands = useMemo(() =>
    Array.from(new Set([...INITIAL_BRANDS, ...history.brands])).sort(),
    [history.brands]);

  const filteredModels = useMemo(() => {
    const initialForBrand = INITIAL_MODELS[formData.brand] || [];
    return Array.from(new Set([...initialForBrand, ...history.models])).sort();
  }, [formData.brand, history.models]);

  const updateField = useCallback((field: string, value: any) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
  }, []);

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `main_${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('vehicles').upload(fileName, file);
    if (uploadError) {
      alert("Erreur upload: " + uploadError.message);
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from('vehicles').getPublicUrl(fileName);
    updateField("image_url", publicUrl);
    setUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (formData.images.length + newImages.length >= 10) {
        alert("Maximum 10 photos dans la galerie !");
        break;
      }
      const fileName = `gallery_${Date.now()}_${i}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('vehicles').upload(fileName, file);
      if (uploadError) {
        alert("Erreur upload: " + uploadError.message);
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from('vehicles').getPublicUrl(fileName);
      newImages.push(publicUrl);
    }

    setFormData((prev: FormData) => ({ ...prev, images: [...prev.images, ...newImages] }));
    setUploadingGallery(false);
    e.target.value = "";
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev: FormData) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const years = Array.from({ length: 2026 - 1950 + 1 }, (_, i) => (2026 - i).toString());
  const fuels = ["Essence", "Diesel", "Hybride", "Électrique", "GPL"];
  const transmissions = [
    { value: "Automatique", label: "Automatique / Digital" },
    { value: "Manuelle", label: "Manuelle" },
    { value: "4x4 / Intégrale", label: "4x4 / Intégrale" },
    { value: "4x2 / Traction", label: "Traction Avant" },
    { value: "Propulsion", label: "Propulsion Arrière" }
  ];
  const statuses = [
    { value: "Disponible", label: "Disponible / En Stock" },
    { value: "Vendu", label: "Déjà Vendu" },
    { value: "Réservé", label: "Réservé" },
    { value: "Arrivage", label: "Arrivage Prochain" }
  ];

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20 font-sans">
      <div className="lg:col-span-2 space-y-10">
        {/* Core Identity Panel */}
        <div className="p-8 md:p-12 rounded-[3.5rem] bg-surface/40 backdrop-blur-3xl border border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 relative z-10 gap-6">
             <div className="flex items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center border border-white/10 shadow-xl group-hover:rotate-12 transition-all">
                   <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                   <h2 className="text-3xl font-black font-heading uppercase italic tracking-tighter text-white">Registre Identité</h2>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Configuration Centrale de l'Actif</p>
                </div>
             </div>
             <label className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/3 border border-white/10 cursor-pointer hover:bg-white/6 transition-all group/star shadow-lg">
               <input
                 type="checkbox"
                 className="hidden"
                 checked={formData.is_featured}
                 onChange={(e) => updateField("is_featured", e.target.checked)}
               />
               <Star className={`w-5 h-5 transition-all ${formData.is_featured ? "text-white fill-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-110" : "text-slate-600 group-hover/star:text-slate-400"}`} />
               <span className={`text-[10px] font-black uppercase tracking-widest ${formData.is_featured ? "text-white" : "text-slate-500"}`}>Priorité Vitrine</span>
             </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Constructeur Autorisé</label>
              <CustomSelect 
                options={allBrands} 
                value={formData.brand} 
                onChange={(val: string) => updateField("brand", val)} 
                placeholder="Sélectionner Marque..."
                icon={Globe}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Désignation Modèle</label>
              <CustomSelect 
                options={filteredModels} 
                value={formData.name} 
                onChange={(val: string) => updateField("name", val)} 
                placeholder="Sélectionner Modèle..."
                icon={Car}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Classification</label>
              <CustomSelect 
                options={CATEGORIES} 
                value={formData.category} 
                onChange={(val: string) => updateField("category", val)} 
                placeholder="Sélectionner Type..."
                icon={Layers}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Disponibilité Commerciale</label>
              <CustomSelect 
                options={statuses} 
                value={formData.status} 
                onChange={(val: string) => updateField("status", val)} 
                placeholder="Statut..."
                icon={Activity}
              />
            </div>
          </div>

          <div className="mt-12 space-y-4 relative z-10">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Narratif Stratégique</label>
            <textarea
              rows={6}
              className="w-full bg-black/40 border border-white/5 rounded-4xl py-8 px-10 focus:border-white/20 outline-none transition-all text-sm font-bold text-white resize-none placeholder:text-slate-800 shadow-inner leading-relaxed"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Définir les spécifications et l'historique..."
            />
          </div>
        </div>

        {/* Technical Specification Hub */}
        <div className="p-8 md:p-12 rounded-[3.5rem] bg-surface/40 backdrop-blur-3xl border border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="flex items-center gap-6 mb-12 relative z-10">
             <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 transition-all">
                <Cpu className="w-8 h-8 text-white" />
             </div>
             <h2 className="text-3xl font-black font-heading uppercase italic tracking-tighter text-white">Modules Techniques</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Année Cycle</label>
              <CustomSelect 
                options={years} 
                value={formData.year} 
                onChange={(val: string) => updateField("year", val)} 
                placeholder="Année..."
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Logique Propulsion</label>
              <CustomSelect 
                options={fuels} 
                value={formData.fuel} 
                onChange={(val: string) => updateField("fuel", val)} 
                placeholder="Carburant..."
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Puissance / HP</label>
              <div className="relative group/field">
                 <Flame className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 transition-colors group-focus-within/field:text-white" />
                 <input
                   type="text"
                   className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-8 focus:border-white/20 outline-none transition-all text-sm font-black text-white shadow-inner placeholder:text-slate-800"
                   value={formData.power}
                   onChange={(e) => updateField("power", e.target.value)}
                   placeholder="ex: 720 HP"
                 />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Interface Transmission</label>
              <CustomSelect 
                options={transmissions} 
                value={formData.transmission} 
                onChange={(val: string) => updateField("transmission", val)} 
                placeholder="Transmission..."
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Évaluation DA</label>
              <input
                type="text"
                required
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-8 focus:border-white/20 outline-none transition-all text-lg font-black text-white shadow-inner italic placeholder:text-slate-800"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="Prix en DA"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Log Distance / ODO</label>
              <input
                type="text"
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-8 focus:border-white/20 outline-none transition-all text-sm font-black text-white shadow-inner placeholder:text-slate-800"
                value={formData.mileage}
                onChange={(e) => updateField("mileage", e.target.value)}
                placeholder="ex: 5,000 KM"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Command Column */}
      <div className="space-y-8">
        {/* Visibility Node */}
        <div className="p-10 rounded-[3rem] bg-surface/40 backdrop-blur-3xl border border-white/5 shadow-2xl relative group">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Signal Global</p>
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Visibilité Publique</p>
             </div>
             <button
                type="button"
                className={`relative w-16 h-8 rounded-full transition-all duration-700 ${formData.is_visible ? "bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]" : "bg-slate-900 border border-white/5"}`}
                onClick={() => updateField("is_visible", !formData.is_visible)}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-700 shadow-xl flex items-center justify-center ${formData.is_visible ? "left-9" : "left-1"}`}>
                   <div className={`w-1 h-1 rounded-full ${formData.is_visible ? "bg-black" : "bg-slate-300"}`}></div>
                </div>
              </button>
          </div>
        </div>

        {/* Hero Asset Node */}
        <div className="p-10 rounded-[3.5rem] bg-surface/40 backdrop-blur-3xl border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <h3 className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-4 text-white">
             <ImageIcon className="w-5 h-5 text-white" /> Visuel Principal
          </h3>
          <div className="relative aspect-video rounded-4xl bg-black border border-white/10 flex flex-col items-center justify-center overflow-hidden group/upload cursor-pointer transition-all hover:border-white/20">
            {formData.image_url ? (
              <>
                <img src={formData.image_url} alt="" className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover/upload:grayscale-0 group-hover/upload:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                   <button
                     type="button"
                     onClick={() => updateField("image_url", "")}
                     className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
                   >
                     <X className="w-8 h-8" />
                   </button>
                </div>
              </>
            ) : (
              <>
                {uploading ? (
                  <div className="text-center animate-pulse">
                     <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Sync en cours...</p>
                  </div>
                ) : (
                  <div className="text-center group/empty">
                    <div className="w-20 h-20 rounded-4xl bg-white/3 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover/upload:bg-white/10 group-hover/upload:border-white/20 transition-all">
                       <Upload className="w-10 h-10 text-slate-700 transition-transform group-hover/upload:-translate-y-2 group-hover/upload:text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Injecter Asset 4K</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleMainUpload}
                />
              </>
            )}
          </div>
        </div>

        {/* Gallery Matrix */}
        <div className="p-10 rounded-[3.5rem] bg-surface/40 backdrop-blur-3xl border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-4 text-white">
              <Layers className="w-5 h-5 text-white" /> Galerie Multi-Angles
            </h3>
            <span className="text-[9px] font-black text-slate-600 bg-black/40 px-4 py-2 rounded-full border border-white/5 tracking-tighter">{formData.images.length} / 10</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
             {formData.images.map((url: string, i: number) => (
               <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group/img shadow-2xl">
                 <img src={url} alt="" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover/img:grayscale-0 group-hover/img:scale-125" />
                 <button
                   type="button"
                   onClick={() => removeGalleryImage(i)}
                   className="absolute inset-0 bg-white/80 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-sm"
                 >
                   <Trash2 className="w-6 h-6 text-black" />
                 </button>
               </div>
             ))}
             {formData.images.length < 10 && (
               <div className="relative aspect-square rounded-2xl border-2 border-dashed border-white/5 flex items-center justify-center hover:border-white/20 transition-all group/plus cursor-pointer bg-black/20 overflow-hidden">
                 {uploadingGallery ? (
                   <Loader2 className="w-8 h-8 text-white animate-spin" />
                 ) : (
                   <div className="text-center">
                      <Plus className="w-8 h-8 text-slate-800 mx-auto mb-2 group-hover/plus:text-white group-hover/plus:rotate-90 transition-all duration-500" />
                      <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Ajouter</p>
                   </div>
                 )}
                 <input
                   type="file"
                   accept="image/*"
                   multiple
                   className="absolute inset-0 opacity-0 cursor-pointer"
                   onChange={handleGalleryUpload}
                   disabled={uploadingGallery}
                 />
               </div>
             )}
          </div>
        </div>

        {/* Global Override Control */}
        <div className="pt-6">
           <button
             type="submit"
             disabled={loading || uploading || uploadingGallery}
             className="w-full group relative px-12 py-8 bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-[3rem] hover:bg-slate-200 transition-all duration-700 flex items-center justify-center gap-6 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] disabled:opacity-50"
           >
             {loading ? <Loader2 className="w-8 h-8 animate-spin relative z-10" /> : <ShieldCheck className="w-8 h-8 relative z-10 transition-transform group-hover:scale-110" />}
             <span className="relative z-10">{loading ? "COMMISSION EN COURS..." : "AUTORISER LE PROTOCOLE"}</span>
             <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
           </button>
           <div className="flex items-center justify-center gap-3 mt-8 opacity-20">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <p className="text-[8px] text-white font-black uppercase tracking-[0.5em]">BENZ AUTO ENGINE v1.0.0</p>
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
           </div>
        </div>
      </div>
    </form>
  );
}
