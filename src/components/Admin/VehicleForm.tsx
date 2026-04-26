"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Save, 
  Upload, 
  X, 
  Image as ImageIcon, 
  CheckCircle2, 
  Star,
  Loader2,
  Zap,
  Car
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";

const INITIAL_BRANDS: string[] = [
  "Peugeot", "Renault", "Citroën", "Dacia", "Volkswagen", "Mercedes-Benz", "BMW", "Audi", "Porsche",
  "Fiat", "Alfa Romeo", "Ferrari", "Lamborghini", "Toyota", "Honda", "Nissan", "Tesla", "Ford", "Jeep",
  "Aston Martin", "Bentley", "Rolls-Royce", "McLaren", "MG", "BYD", "Polestar", "Abarth", "Acura", "Aiways", "Alpine", "Alpina"
];

const INITIAL_MODELS: Record<string, string[]> = {
  "Peugeot": ["208", "308", "408", "508", "2008", "3008", "5008", "Rifter"],
  "Renault": ["Twingo", "Clio", "Captur", "Mégane E-Tech", "Scenic", "Austral", "Espace", "Rafale", "Renault 5 E-Tech"],
  "Citroën": ["C3", "C3 Aircross", "C4", "C4 X", "C5 Aircross", "C5 X", "Ami"],
  "Dacia": ["Sandero", "Logan", "Jogger", "Duster", "Spring"],
  "Volkswagen": ["Polo", "Golf", "ID.3", "ID.4", "ID.5", "ID.7", "T-Cross", "Taigo", "T-Roc", "Tiguan", "Touareg", "Passat"],
  "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe E", "Classe S", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "Classe G", "EQA", "EQB", "EQS"],
  "BMW": ["Série 1", "Série 3", "Série 5", "X1", "X3", "X5", "X6", "X7", "i7", "iX"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "e-tron GT"],
  "Porsche": ["718 Cayman", "911", "Panamera", "Macan", "Cayenne", "Taycan"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  "Toyota": ["Yaris", "Corolla", "C-HR", "RAV4", "Prius", "Land Cruiser", "Supra"]
};

const INITIAL_ENGINES: string[] = [
  "3 cylindres Turbo", "4 cylindres Turbo", "6 cylindres en ligne", "V6 Biturbo", "V8 Biturbo", "V10 Atmo", "V12 Atmo",
  "Boxer 4 cylindres", "Boxer 6 cylindres", "W16 Quad-Turbo", "Rotatif (Wankel)",
  "Électrique (Moteur Unique)", "Électrique (Dual-Motor 4x4)", "Électrique (Tri-Motor / Plaid)", "Électrique (Quad-Motor)",
  "Hydrogène (Pile à combustible)"
];

interface VehicleFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export function VehicleForm({ initialData, onSubmit, loading }: VehicleFormProps) {
  const supabase = createClient();
  const [formData, setFormData] = useState({
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
    images: [] as string[],
    is_visible: true,
    is_featured: false,
    status: "Disponible",
  });

  const [uploading, setUploading] = useState(false);
  const [history, setHistory] = useState({
    brands: [] as string[],
    models: [] as string[],
    engines: [] as string[]
  });

  useEffect(() => {
    if (initialData) setFormData({ ...formData, ...initialData });
    fetchHistory();
  }, [initialData]);

  const fetchHistory = async () => {
    // Fetch distinct values from existing products to populate suggestions
    const { data: products } = await supabase.from("products").select("brand, name, engine");
    if (products) {
      const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
      const models = Array.from(new Set(products.map(p => p.name).filter(Boolean)));
      const engines = Array.from(new Set(products.map(p => p.engine).filter(Boolean)));
      setHistory({ brands, models, engines });
    }
  };

  const allBrands = useMemo(() => {
    return Array.from(new Set([...INITIAL_BRANDS, ...history.brands])).sort();
  }, [history.brands]);

  const allEngines = useMemo(() => {
    return Array.from(new Set([...INITIAL_ENGINES, ...history.engines])).sort();
  }, [history.engines]);

  const filteredModels = useMemo(() => {
    const initialForBrand = INITIAL_MODELS[formData.brand] || [];
    // Only show custom models if they belong to this brand or if we don't have brand-specific logic for them yet
    // For simplicity, we show all historical models that aren't in our initial list
    return Array.from(new Set([...initialForBrand, ...history.models])).sort();
  }, [formData.brand, history.models]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'main' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('products').upload(`vehicles/${fileName}`, file);

    if (uploadError) {
      alert("Error: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(`vehicles/${fileName}`);
    if (field === 'main') setFormData({ ...formData, image_url: publicUrl });
    else setFormData({ ...formData, images: [...formData.images, publicUrl] });
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-dark p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Car className="w-5 h-5 text-[#ff0000]" />
              Identification
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="hidden" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} />
              <Star className={`w-5 h-5 ${formData.is_featured ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
              <span className="text-xs font-bold text-gray-400">Featured</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Marque</label>
              <input 
                list="brands" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000]"
                value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} placeholder="Sélectionner ou écrire..."
              />
              <datalist id="brands">
                {allBrands.map(b => <option key={b} value={b} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Modèle</label>
              <input 
                list="models" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000]"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="ex: G63 AMG"
              />
              <datalist id="models">
                {filteredModels.map(m => <option key={m} value={m} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Catégorie</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000]" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="SUV">SUV</option>
                <option value="4x4 / Pick-up">4x4 / Pick-up</option>
                <option value="Sportive">Sportive</option>
                <option value="Berline">Berline</option>
                <option value="Luxe">Luxe</option>
                <option value="Utilitaire">Utilitaire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Statut</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000]" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Disponible">Disponible</option>
                <option value="Vendu">Vendu</option>
                <option value="Réservé">Réservé</option>
                <option value="Arrivage">Arrivage</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-dark p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-[#ff0000]" /> Spécifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Année</label>
              <input list="years" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000]" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
              <datalist id="years">{Array.from({ length: 2026 - 1950 + 1 }, (_, i) => 2026 - i).map(y => <option key={y} value={y} />)}</datalist>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Carburant</label>
              <input list="fuels" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000]" value={formData.fuel} onChange={(e) => setFormData({...formData, fuel: e.target.value})} />
              <datalist id="fuels">
                <option value="Essence (Sans Plomb)" /><option value="Diesel (Gazole)" /><option value="GPL" /><option value="GPL + Essence" /><option value="GPL + Diesel" />
                <option value="Hybride + essence" /><option value="Hybride + diesel" /><option value="Hybride Rechargeable" /><option value="100% Électrique" />
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Moteur</label>
              <input list="engines" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000]" value={formData.engine} onChange={(e) => setFormData({...formData, engine: e.target.value})} />
              <datalist id="engines">{allEngines.map(e => <option key={e} value={e} />)}</datalist>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Transmission / Motricité</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000]" value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})}>
                <option value="Automatique">Automatique</option><option value="Manuelle">Manuelle</option><option value="4x4 / Intégrale">4x4 / Intégrale</option><option value="4x2 / Traction">4x2 / Traction</option><option value="Propulsion">Propulsion</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Prix</label>
              <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000]" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Kilométrage</label>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000]" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-dark p-8 rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-[#ff0000]" /> Média</h2>
          <div className="relative aspect-video rounded-2xl bg-black/50 border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-4 group">
            {formData.image_url ? (
              <><img src={formData.image_url} className="absolute inset-0 w-full h-full object-cover rounded-2xl" /><button type="button" onClick={() => setFormData({...formData, image_url: ""})} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button></>
            ) : (
              <>{uploading ? <Loader2 className="w-8 h-8 text-[#ff0000] animate-spin" /> : <Upload className="w-8 h-8 text-gray-600" />}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'main')} /></>
            )}
          </div>
        </div>
        <button type="submit" disabled={loading || uploading} className="w-full py-5 bg-[#ff0000] text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.4)]">
          {loading ? <Loader2 className="w-6 h-6 animate-spin inline mr-2" /> : <Save className="w-6 h-6 inline mr-2" />} Enregistrer
        </button>
      </div>
    </form>
  );
}
