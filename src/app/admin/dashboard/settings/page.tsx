"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Settings, Save, Power, Lock, RefreshCw, Database,
  Smartphone, Camera, Users, Video, Send, Music,
  MessageCircle, ChevronDown, Check, Trash2, Plus
} from "lucide-react";
import { createClient } from "../../../../utils/supabase/client";
import { Sidebar } from "../../../../components/Admin/Sidebar";

const SOCIAL_PLATFORMS = [
  { name: "Instagram", icon: Camera },
  { name: "Facebook", icon: Users },
  { name: "YouTube", icon: Video },
  { name: "Canal/Telegram", icon: Send },
  { name: "TikTok", icon: Music },
  { name: "X (Twitter)", icon: MessageCircle }
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [config, setConfig] = useState<any>({
    site_name: "Benz Auto DZ",
    contact_email: "",
    contact_phone: "",
    address: "",
    social_links: { "Instagram": "" }
  });
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchSettings();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) {
      let sLinks = data.social_links;
      // Sécurité : Si c'est un tableau, on le transforme en objet
      if (Array.isArray(sLinks) || !sLinks) {
        sLinks = {};
      }
      
      setConfig({
        ...data,
        social_links: sLinks
      });
      setMaintenance(data.maintenance_mode);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from("site_settings").update({ 
      ...config, 
      maintenance_mode: maintenance 
    }).eq("id", 1);

    setLoading(false);
    
    if (error) {
      console.error("Save error:", error);
      alert("❌ Erreur de sauvegarde : Les colonnes n'existent probablement pas dans ta base de données Supabase. As-tu exécuté le script SQL dans le SQL Editor ?\n\nErreur : " + error.message);
    } else {
      alert("✅ Configuration sauvegardée avec succès.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 flex flex-col xl:flex-row p-4 gap-4 font-sans">
      <Sidebar onLogout={handleLogout} />

      <main className="grow flex flex-col min-w-0 gap-4">
        <header className="bg-surface border border-white/5 rounded-3xl px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Paramètres</h1>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] mt-0.5">Configuration du Site</p>
            </div>
          </div>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </header>

        <div className="grow overflow-y-auto custom-scrollbar pr-2 pb-10">
          <div className="max-w-4xl space-y-4">
            
            <div className={`p-6 rounded-3xl border transition-colors flex flex-col sm:flex-row items-center justify-between gap-6 ${maintenance ? "bg-red-500/10 border-red-500/20" : "bg-surface border-white/5"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${maintenance ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white border border-white/10"}`}>
                  <Power className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-white">Mode Maintenance</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${maintenance ? "text-red-400" : "text-slate-500"}`}>
                    {maintenance ? "Site inaccessible aux visiteurs" : "Site en ligne et accessible"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setMaintenance(!maintenance)}
                className={`relative w-16 h-8 rounded-full transition-colors ${maintenance ? "bg-red-500" : "bg-white/10"}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all flex items-center justify-center ${maintenance ? "left-9" : "left-1"}`}>
                  {maintenance ? <Lock className="w-3 h-3 text-red-500" /> : <RefreshCw className="w-3 h-3 text-slate-400" />}
                </div>
              </button>
            </div>

            <div className="p-8 bg-surface border border-white/5 rounded-3xl">
              <h3 className="text-sm font-black uppercase text-white mb-6 flex items-center gap-2">
                <Database className="w-4 h-4" /> Informations Générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Nom du Site</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                    value={config.site_name || ""}
                    onChange={e => setConfig({...config, site_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Adresse</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                    value={config.address || ""}
                    onChange={e => setConfig({...config, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email de Contact</label>
                  <input 
                    type="email" 
                    className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                    value={config.contact_email || ""}
                    onChange={e => setConfig({...config, contact_email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Téléphone</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                    value={config.contact_phone || ""}
                    onChange={e => setConfig({...config, contact_phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Description du Site (Footer)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white resize-none"
                  value={config.site_description || ""}
                  onChange={e => setConfig({...config, site_description: e.target.value})}
                  placeholder="Texte de présentation qui s'affiche dans le pied de page..."
                ></textarea>
              </div>

              <h3 className="text-sm font-black uppercase text-white mt-10 mb-6 flex items-center gap-2 pt-6 border-t border-white/5">
                <Smartphone className="w-4 h-4" /> Réseaux Sociaux
              </h3>
              
              <div className="max-w-md relative" ref={dropdownRef}>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Ajouter un réseau</label>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)} 
                  className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 flex items-center justify-between text-xs font-bold text-slate-300 hover:border-white/20 transition-colors"
                >
                  <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Sélectionner les réseaux...</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {showDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-white/5 rounded-xl p-2 z-50 shadow-2xl flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar">
                    {SOCIAL_PLATFORMS.map(platform => {
                      const isSelected = config.social_links?.hasOwnProperty(platform.name);
                      return (
                        <button 
                          key={platform.name}
                          onClick={() => {
                            const newLinks = { ...(config.social_links || {}) };
                            if (isSelected) delete newLinks[platform.name];
                            else newLinks[platform.name] = "";
                            setConfig({ ...config, social_links: newLinks });
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group"
                        >
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-white border-white text-black' : 'border-slate-500 group-hover:border-slate-300'}`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <platform.icon className={`w-4 h-4 transition-colors ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                          <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-white' : 'text-slate-400'}`}>{platform.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-4 mt-6">
                {config.social_links && Object.keys(config.social_links).length === 0 && (
                   <div className="py-6 text-center border border-dashed border-white/5 rounded-xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Aucun réseau social configuré</p>
                   </div>
                )}
                {config.social_links && Object.keys(config.social_links).map(platformName => {
                  const platform = SOCIAL_PLATFORMS.find(p => p.name === platformName);
                  const Icon = platform ? platform.icon : Smartphone;
                  return (
                    <div key={platformName} className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="grow">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 ml-1">{platformName}</label>
                        <input 
                          type="text" 
                          className="w-full bg-background border border-white/5 rounded-xl py-2.5 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                          value={config.social_links[platformName]}
                          onChange={e => setConfig({
                            ...config, 
                            social_links: { ...config.social_links, [platformName]: e.target.value }
                          })}
                          placeholder={`Lien ${platformName}`}
                        />
                      </div>
                      <button 
                        onClick={() => {
                           const newLinks = { ...config.social_links };
                           delete newLinks[platformName];
                           setConfig({ ...config, social_links: newLinks });
                        }}
                        className="w-12 h-12 mt-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors shrink-0"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
