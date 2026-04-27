"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings, Save, Power, Lock, RefreshCw, Database,
  Smartphone
} from "lucide-react";
import { createClient } from "../../../../utils/supabase/client";
import { Sidebar } from "../../../../components/Admin/Sidebar";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [config, setConfig] = useState({
    site_name: "Benz Auto DZ",
    contact_email: "",
    contact_phone: "",
    address: "",
    facebook_url: "",
    instagram_url: "",
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) {
      setConfig(data);
      setMaintenance(data.maintenance_mode);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("site_settings").update({ ...config, maintenance_mode: maintenance }).eq("id", 1);
    setLoading(false);
    alert("Configuration sauvegardée avec succès.");
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
                    value={config.site_name}
                    onChange={e => setConfig({...config, site_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Adresse</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                    value={config.address}
                    onChange={e => setConfig({...config, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email de Contact</label>
                  <input 
                    type="email" 
                    className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                    value={config.contact_email}
                    onChange={e => setConfig({...config, contact_email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Téléphone</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                    value={config.contact_phone}
                    onChange={e => setConfig({...config, contact_phone: e.target.value})}
                  />
                </div>
              </div>

              <h3 className="text-sm font-black uppercase text-white mt-10 mb-6 flex items-center gap-2 pt-6 border-t border-white/5">
                <Smartphone className="w-4 h-4" /> Réseaux Sociaux
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Lien Facebook</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                    value={config.facebook_url}
                    onChange={e => setConfig({...config, facebook_url: e.target.value})}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Lien Instagram</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                    value={config.instagram_url}
                    onChange={e => setConfig({...config, instagram_url: e.target.value})}
                    placeholder="https://instagram.com/..."
                  />
                </div>
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
