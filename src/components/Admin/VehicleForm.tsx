"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Save, Upload, X, Loader2, Car, Plus, ChevronDown,
  Trash2, Search, Star, ImageIcon, CheckCircle
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";

// ─── Brand / Model Data ───────────────────────────────────────────────────────
const MODELS: Record<string, string[]> = {
  "Audi": ["A1","A3","A5","A6","A8","Q3","Q5","Q7","Q8","RS6","TT"],
  "BMW": ["Série 1","Série 3","Série 5","Série 7","X1","X3","X5","X6","X7","M3","M5","Z4"],
  "Mercedes-Benz": ["Classe A","Classe C","Classe E","Classe G","Classe S","GLA","GLC","GLE","GLS","CLA","AMG GT"],
  "Volkswagen": ["Golf","Polo","Passat","Tiguan","Touareg","T-Roc","ID.4"],
  "Toyota": ["Yaris","Corolla","Camry","RAV4","Land Cruiser","C-HR","Supra","Hilux"],
  "Renault": ["Clio","Megane","Arkana","Captur","Austral","Kadjar","Trafic"],
  "Peugeot": ["208","308","508","2008","3008","5008","Partner"],
  "Ford": ["Focus","Kuga","Mustang","Puma","Explorer","Ranger"],
  "Hyundai": ["i10","i20","i30","Tucson","Santa Fe","Kona","Ioniq 5"],
  "KIA": ["Picanto","Ceed","Sportage","Sorento","EV6","Niro"],
  "Tesla": ["Model 3","Model Y","Model S","Model X"],
  "Porsche": ["Cayenne","Macan","Panamera","911","Taycan"],
  "Volvo": ["XC40","XC60","XC90","S60","V60"],
  "Nissan": ["Micra","Juke","Qashqai","X-Trail","Ariya"],
  "Fiat": ["500","Panda","Tipo","500X","Doblo"],
  "Opel": ["Corsa","Astra","Mokka","Grandland","Crossland"],
};
const BRANDS = Object.keys(MODELS).sort();

const CATEGORIES = ["SUV","Berline","Sportive","Coupé","Break","Cabriolet","4x4 / Pick-up","Utilitaire","Compacte","Luxe","Monospace"];
const FUELS = ["Essence","Diesel","Hybride","Électrique","GPL"];
const TRANSMISSIONS = ["Automatique","Manuelle","4x4 / Intégrale","Traction Avant","Propulsion Arrière"];
const STATUSES = [
  { value: "Disponible", label: "Disponible" },
  { value: "Vendu", label: "Vendu" },
  { value: "Réservé", label: "Réservé" },
  { value: "Arrivage", label: "Arrivage prochain" },
];

// ─── Custom Searchable Select ─────────────────────────────────────────────────
function SearchSelect({ options, value, onChange, placeholder }: {
  options: string[]; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = useMemo(() =>
    options.filter(o => o.toLowerCase().includes(q.toLowerCase())),
    [options, q]
  );

  return (
    <div className={`relative ${open ? "z-50" : "z-10"}`} ref={ref}>
      <button type="button" onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-all ${open ? "border-white/30 bg-white/5" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
        <span className={value ? "text-white font-medium" : "text-slate-600"}>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 w-full bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
              <input autoFocus type="text" value={q} onChange={e => setQ(e.target.value)}
                placeholder="Rechercher..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none" />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.map(opt => (
              <button key={opt} type="button"
                onClick={() => { onChange(opt); setOpen(false); setQ(""); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all ${value === opt ? "bg-white text-black font-bold" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                {opt}
              </button>
            ))}
            {q && !options.some(o => o.toLowerCase() === q.toLowerCase()) && (
              <button type="button"
                onClick={() => { onChange(q); setOpen(false); setQ(""); }}
                className="w-full text-left px-4 py-2.5 text-sm text-amber-400 font-bold hover:bg-white/5 border-t border-white/5 flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" /> Ajouter &quot;{q}&quot;
              </button>
            )}
            {filtered.length === 0 && !q && (
              <p className="py-6 text-center text-xs text-slate-700">Saisissez pour ajouter</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Field Components ─────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{children}</label>;
}
function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-all placeholder:text-slate-700" />
  );
}
function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-all appearance-none cursor-pointer">
      {children}
    </select>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  name: string; brand: string; category: string; price: string;
  image_url: string; description: string; year: string; mileage: string;
  location: string; engine: string; power: string; transmission: string;
  fuel: string; images: string[]; is_visible: boolean;
  is_featured: boolean; status: string;
}

interface VehicleFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export function VehicleForm({ initialData, onSubmit, loading }: VehicleFormProps) {
  const supabase = createClient();
  const years = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => String(2026 - i));

  const defaults: FormData = {
    name: "", brand: "", category: "SUV", price: "", image_url: "",
    description: "", year: "", mileage: "", location: "Showroom Alger",
    engine: "", power: "", transmission: "Automatique", fuel: "Essence",
    images: [], is_visible: true, is_featured: false, status: "Disponible",
  };

  const [form, setForm] = useState<FormData>({ ...defaults, ...initialData,
    images: Array.isArray(initialData?.images) ? initialData.images : [] });
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("products").select("brand").then(({ data }) => {
      if (data) {
        const extra = [...new Set(data.map((d: { brand: string }) => d.brand).filter(Boolean))];
        setHistory(extra);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initialData) setForm({ ...defaults, ...initialData,
      images: Array.isArray(initialData.images) ? initialData.images : [] });
  }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const allBrands = useMemo(() =>
    [...new Set([...BRANDS, ...history])].sort(), [history]);

  const modelOptions = useMemo(() =>
    MODELS[form.brand] || [], [form.brand]);

  const set = useCallback((field: keyof FormData, value: FormData[keyof FormData]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const name = `main_${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("vehicles").upload(name, file);
    if (error) { setUploadError("Erreur upload : " + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("vehicles").getPublicUrl(name);
    set("image_url", publicUrl);
    setUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    if (form.images.length >= 10) { setUploadError("Maximum 10 photos dans la galerie."); return; }
    setUploadingGallery(true);
    setUploadError("");
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (form.images.length + urls.length >= 10) break;
      const file = files[i];
      const name = `gallery_${Date.now()}_${i}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("vehicles").upload(name, file);
      if (error) { setUploadError("Erreur upload galerie."); continue; }
      const { data: { publicUrl } } = supabase.storage.from("vehicles").getPublicUrl(name);
      urls.push(publicUrl);
    }
    setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    setUploadingGallery(false);
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16">

      {/* ── LEFT: Main Fields ─────────────────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-5">

        {/* Section 1: Identité */}
        <div className="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-5 flex items-center gap-2">
            <Car className="w-4 h-4" /> Informations du véhicule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Marque *</Label>
              <SearchSelect options={allBrands} value={form.brand}
                onChange={v => { set("brand", v); set("name", ""); }}
                placeholder="Choisir une marque" />
            </div>
            <div>
              <Label>Modèle *</Label>
              {modelOptions.length > 0 ? (
                <SearchSelect options={modelOptions} value={form.name}
                  onChange={v => set("name", v)} placeholder="Choisir un modèle" />
              ) : (
                <Input value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="Saisir le modèle" />
              )}
            </div>
            <div>
              <Label>Catégorie</Label>
              <Select value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={form.status} onChange={e => set("status", e.target.value)}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                rows={4} placeholder="Décrivez le véhicule, son historique, ses options..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-all placeholder:text-slate-700 resize-none" />
            </div>
          </div>
        </div>

        {/* Section 2: Technique */}
        <div className="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-5">
            🔧 Caractéristiques techniques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Année</Label>
              <Select value={form.year} onChange={e => set("year", e.target.value)}>
                <option value="">— Sélectionner —</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </Select>
            </div>
            <div>
              <Label>Carburant</Label>
              <Select value={form.fuel} onChange={e => set("fuel", e.target.value)}>
                {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
              </Select>
            </div>
            <div>
              <Label>Transmission</Label>
              <Select value={form.transmission} onChange={e => set("transmission", e.target.value)}>
                {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
            <div>
              <Label>Kilométrage</Label>
              <Input value={form.mileage} onChange={e => set("mileage", e.target.value)}
                placeholder="ex: 45 000 km" />
            </div>
            <div>
              <Label>Puissance (CV/HP)</Label>
              <Input value={form.power} onChange={e => set("power", e.target.value)}
                placeholder="ex: 450 CV" />
            </div>
            <div>
              <Label>Moteur</Label>
              <Input value={form.engine} onChange={e => set("engine", e.target.value)}
                placeholder="ex: V8 4.0L Biturbo" />
            </div>
            <div>
              <Label>Prix *</Label>
              <Input required value={form.price} onChange={e => set("price", e.target.value)}
                placeholder="ex: 15 500 000 DA" />
            </div>
            <div>
              <Label>Localisation</Label>
              <Input value={form.location} onChange={e => set("location", e.target.value)}
                placeholder="ex: Showroom Alger" />
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Media + Options ────────────────────────────────────────── */}
      <div className="space-y-5">

        {/* Options */}
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <h2 className="text-xs font-black text-white uppercase tracking-widest mb-4">Options</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="text-sm font-bold text-white">Visible au public</p>
                <p className="text-xs text-slate-600">Afficher dans le showroom</p>
              </div>
              <button type="button" onClick={() => set("is_visible", !form.is_visible)}
                className={`w-12 h-6 rounded-full transition-all relative ${form.is_visible ? "bg-white" : "bg-white/10 border border-white/10"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${form.is_visible ? "left-7" : "left-1"}`} />
              </button>
            </label>
            <div className="border-t border-white/5" />
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="text-sm font-bold text-white">Mis en avant</p>
                <p className="text-xs text-slate-600">Afficher en vedette</p>
              </div>
              <button type="button" onClick={() => set("is_featured", !form.is_featured)}
                className={`w-12 h-6 rounded-full transition-all relative ${form.is_featured ? "bg-white" : "bg-white/10 border border-white/10"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${form.is_featured ? "left-7" : "left-1"}`} />
              </button>
            </label>
          </div>
        </div>

        {/* Photo principale */}
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Photo principale
          </h2>
          <label className={`relative flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${form.image_url ? "border-white/20" : "border-white/10 hover:border-white/20"}`}>
            {form.image_url ? (
              <>
                <img src={form.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <button type="button" onClick={e => { e.preventDefault(); set("image_url", ""); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/80 rounded-lg flex items-center justify-center hover:bg-red-500 transition-all z-10">
                  <X className="w-4 h-4 text-white" />
                </button>
              </>
            ) : uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <p className="text-xs text-slate-500">Upload en cours...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 p-6">
                <Upload className="w-8 h-8 text-slate-600" />
                <p className="text-xs font-bold text-slate-500">Cliquer pour ajouter</p>
                <p className="text-[10px] text-slate-700">JPG, PNG, WEBP</p>
              </div>
            )}
            {!form.image_url && !uploading && (
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleMainUpload} />
            )}
          </label>
        </div>

        {/* Galerie */}
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-white uppercase tracking-widest">Galerie</h2>
            <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-2 py-1 rounded-lg">{form.images.length}/10</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {form.images.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden group/img border border-white/5">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                  className="absolute inset-0 bg-black/70 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all">
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
            {form.images.length < 10 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-white/10 hover:border-white/20 flex items-center justify-center cursor-pointer transition-all">
                {uploadingGallery ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Plus className="w-5 h-5 text-slate-600" />}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
              </label>
            )}
          </div>
        </div>

        {/* Error */}
        {uploadError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-xs font-bold">
            {uploadError}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading || uploading || uploadingGallery}
          className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50 shadow-xl">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
          {loading ? "Enregistrement..." : "Enregistrer le véhicule"}
        </button>
      </div>
    </form>
  );
}
