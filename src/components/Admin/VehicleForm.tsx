"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  GripVertical
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

  // Use a ref-like approach: initialize state once, correctly
  const getInitialFormData = useCallback(() => {
    const base = {
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
    };
    if (initialData) {
      return {
        ...base,
        ...initialData,
        // Ensure images is always an array
        images: Array.isArray(initialData.images) ? initialData.images : [],
        // Preserve the category from the database
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

  // When initialData changes (e.g. on edit page load), update form
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

  const allEngines = useMemo(() =>
    Array.from(new Set([...INITIAL_ENGINES, ...history.engines])).sort(),
    [history.engines]);

  const filteredModels = useMemo(() => {
    const initialForBrand = INITIAL_MODELS[formData.brand] || [];
    return Array.from(new Set([...initialForBrand, ...history.models])).sort();
  }, [formData.brand, history.models]);

  // Stable update function to avoid stale closures
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
      // Check max 10 images total
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
    // Reset input
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

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      <div className="lg:col-span-2 space-y-6">
        {/* Identification */}
        <div className="glass-dark p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Car className="w-5 h-5 text-[#ff0000]" />
              Identification
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="hidden"
                checked={formData.is_featured}
                onChange={(e) => updateField("is_featured", e.target.checked)}
              />
              <Star className={`w-5 h-5 ${formData.is_featured ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
              <span className="text-xs font-bold text-gray-400">Featured</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Marque</label>
              <input
                list="brands"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                placeholder="Sélectionner ou écrire..."
              />
              <datalist id="brands">
                {allBrands.map(b => <option key={b} value={b} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Modèle / Nom</label>
              <input
                list="models"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="ex: G63 AMG"
                required
              />
              <datalist id="models">
                {filteredModels.map(m => <option key={m} value={m} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Catégorie</label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Statut</label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option value="Disponible">Disponible</option>
                <option value="Vendu">Vendu</option>
                <option value="Réservé">Réservé</option>
                <option value="Arrivage">Arrivage</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Description</label>
            <textarea
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors resize-none"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Décrivez le véhicule en détail..."
            />
          </div>
        </div>

        {/* Specs */}
        <div className="glass-dark p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-[#ff0000]" /> Spécifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Année</label>
              <input
                list="years"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.year}
                onChange={(e) => updateField("year", e.target.value)}
              />
              <datalist id="years">{Array.from({ length: 2026 - 1950 + 1 }, (_, i) => 2026 - i).map(y => <option key={y} value={y} />)}</datalist>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Carburant</label>
              <input
                list="fuels"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.fuel}
                onChange={(e) => updateField("fuel", e.target.value)}
              />
              <datalist id="fuels">
                <option value="Essence (Sans Plomb)" /><option value="Diesel (Gazole)" /><option value="GPL" /><option value="GPL + Essence" /><option value="GPL + Diesel" />
                <option value="Hybride + essence" /><option value="Hybride + diesel" /><option value="Hybride Rechargeable" /><option value="100% Électrique" />
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Moteur</label>
              <input
                list="engines"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.engine}
                onChange={(e) => updateField("engine", e.target.value)}
              />
              <datalist id="engines">{allEngines.map(e => <option key={e} value={e} />)}</datalist>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Puissance</label>
              <input
                type="text"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.power}
                onChange={(e) => updateField("power", e.target.value)}
                placeholder="ex: 585 ch"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Transmission / Motricité</label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.transmission}
                onChange={(e) => updateField("transmission", e.target.value)}
              >
                <option value="Automatique">Automatique</option>
                <option value="Manuelle">Manuelle</option>
                <option value="4x4 / Intégrale">4x4 / Intégrale</option>
                <option value="4x2 / Traction">4x2 / Traction</option>
                <option value="Propulsion">Propulsion</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Prix</label>
              <input
                type="text"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="ex: 12,500,000 DA"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Kilométrage</label>
              <input
                type="text"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.mileage}
                onChange={(e) => updateField("mileage", e.target.value)}
                placeholder="ex: 45,000 km"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Localisation</label>
              <input
                type="text"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#ff0000] transition-colors"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="ex: Showroom Alger"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column — Media */}
      <div className="space-y-6">
        {/* Main Image */}
        <div className="glass-dark p-6 rounded-3xl border border-white/10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-[#ff0000]" /> Photo Principale</h2>
          <div className="relative aspect-video rounded-2xl bg-black/50 border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden group">
            {formData.image_url ? (
              <>
                <img src={formData.image_url} alt="" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
                <button
                  type="button"
                  onClick={() => updateField("image_url", "")}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full z-10 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-[#ff0000] animate-spin" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Cliquez pour uploader</p>
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

        {/* Gallery (1 to 10 photos) */}
        <div className="glass-dark p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-[#ff0000]" /> Galerie
            </h2>
            <span className="text-xs text-gray-500">{formData.images.length}/10 photos</span>
          </div>

          {/* Existing gallery images */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {formData.images.map((url: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload button for gallery */}
          {formData.images.length < 10 && (
            <div className="relative rounded-xl border-2 border-dashed border-white/10 p-4 flex flex-col items-center justify-center hover:border-[#ff0000]/40 transition-colors cursor-pointer">
              {uploadingGallery ? (
                <Loader2 className="w-6 h-6 text-[#ff0000] animate-spin" />
              ) : (
                <>
                  <Plus className="w-6 h-6 text-gray-600 mb-1" />
                  <p className="text-xs text-gray-500">Ajouter des photos</p>
                  <p className="text-[10px] text-gray-600 mt-1">Sélection multiple possible</p>
                </>
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

        {/* Visibility toggle */}
        <div className="glass-dark p-6 rounded-3xl border border-white/10">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-bold text-sm">Visible sur le site</span>
            <div
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${formData.is_visible ? "bg-green-500" : "bg-gray-700"}`}
              onClick={() => updateField("is_visible", !formData.is_visible)}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${formData.is_visible ? "left-6" : "left-0.5"}`} />
            </div>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploading || uploadingGallery}
          className="w-full py-5 bg-[#ff0000] text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:bg-[#cc0000] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          {loading ? "Enregistrement..." : "Enregistrer le Véhicule"}
        </button>
      </div>
    </form>
  );
}
