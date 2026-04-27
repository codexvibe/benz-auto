"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, Users, Video, MessageSquare, Tag,
  Settings, Eye, LogOut, Save, Shield, Globe, Bell, Smartphone,
  Activity, ArrowRight, ShieldCheck, ChevronRight, Zap, RefreshCw,
  Power, Lock, Database, HardDrive, Cpu, Car
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventaire" },
  { href: "/admin/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/admin/dashboard/videos", icon: Video, label: "Médias (Reels)" },
  { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes" },
  { href: "/admin/dashboard/promos", icon: Tag, label: "Promotions" },
  { href: "/admin/dashboard/settings", icon: Settings, label: "Paramètres", active: true },
];

function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-full xl:w-80 bg-surface/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col shrink-0 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="flex items-center gap-4 mb-16">
        <div className="w-14 h-14 rounded-2xl bg-surface border border-white/10 flex items-center justify-center shadow-2xl rotate-3">
          <Car className="w-8 h-8 text-white" />
        </div>
        <div>
          <span className="font-heading font-black text-2xl tracking-tight text-white block uppercase">BENZ AUTO</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1 block">Espace Admin</span>
        </div>
      </div>
      <nav className="space-y-3 grow">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group relative overflow-hidden ${item.active ? "bg-white/5 text-white shadow-lg" : "text-slate-500 hover:text-slate-200 hover:bg-white/2"}`}>
            {item.active && <div className="absolute left-0 top-0 w-1 h-full bg-white"></div>}
            <item.icon className={`w-5 h-5 transition-all duration-500 ${item.active ? "text-white scale-110" : "group-hover:text-slate-200"}`} />
            <span className="text-sm uppercase tracking-widest">{item.label}</span>
            {item.active && <ArrowRight className="w-4 h-4 ml-auto text-white animate-bounce-x" />}
          </Link>
        ))}
      </nav>
      <button onClick={onLogout} className="w-full flex items-center justify-between px-8 py-5 rounded-3xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/3 hover:border-white/10 transition-all duration-500 group mt-auto">
        <span className="text-sm font-black uppercase tracking-widest">Déconnexion</span>
        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </aside>
  );
}

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
  }, []);

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
    alert("CONFIGURATION SYSTÈME MISE À JOUR : Variables globales synchronisées.");
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 flex flex-col xl:flex-row p-4 md:p-6 gap-4 md:gap-6 font-sans">
      <Sidebar onLogout={handleLogout} />

      <main className="grow flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="min-h-28 py-6 md:py-0 bg-surface/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] mb-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-6 md:px-10 shadow-xl relative overflow-hidden shrink-0">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-white/10 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase">Protocole Système</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Configuration Centrale</p>
            </div>
          </div>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="group relative px-12 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-4xl hover:bg-slate-200 transition-all duration-500 flex items-center gap-4 overflow-hidden shadow-2xl disabled:opacity-50 mt-4 md:mt-0"
          >
            <Save className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{loading ? "SYNCHRONISATION..." : "ENREGISTRER"}</span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </header>

        <div className="grow overflow-y-auto custom-scrollbar pr-2 pb-10">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Config */}
              <div className="lg:col-span-2 space-y-6">
                 {/* Maintenance Shield */}
                 <div className={`p-8 md:p-10 rounded-[3.5rem] border transition-all duration-1000 relative overflow-hidden group shadow-2xl ${maintenance ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-white/10"}`}>
                    <div className="absolute top-0 right-0 w-96 h-96 opacity-10 blur-3xl pointer-events-none transition-all duration-1000 group-hover:scale-150">
                       {maintenance ? <div className="w-full h-full bg-red-500"></div> : <div className="w-full h-full bg-white"></div>}
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                       <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                          <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center border shadow-xl transition-all duration-1000 ${maintenance ? "bg-red-500/20 border-red-500/30 text-red-400 rotate-12" : "bg-white/10 border-white/20 text-white"}`}>
                             <Power className="w-10 h-10" />
                          </div>
                          <div>
                             <h3 className="text-3xl font-black font-heading uppercase italic tracking-tighter text-white">Mode Maintenance</h3>
                             <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${maintenance ? "text-red-500" : "text-slate-400"}`}>
                                {maintenance ? "ACCÈS RESTREINT : Site public déconnecté" : "SYSTÈME ACTIF : Transmission opérationnelle"}
                             </p>
                          </div>
                       </div>
                       <button 
                         onClick={() => setMaintenance(!maintenance)}
                         className={`relative w-24 h-12 rounded-full transition-all duration-700 ${maintenance ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]" : "bg-slate-800"}`}
                       >
                          <div className={`absolute top-1.5 w-9 h-9 bg-white rounded-full transition-all duration-700 shadow-2xl flex items-center justify-center ${maintenance ? "left-13" : "left-1.5"}`}>
                             {maintenance ? <Lock className="w-4 h-4 text-red-500" /> : <RefreshCw className="w-4 h-4 text-slate-400" />}
                          </div>
                       </button>
                    </div>
                 </div>

                 {/* System Fields */}
                 <div className="p-8 md:p-12 bg-surface/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <h3 className="text-xl font-black font-heading uppercase italic mb-10 flex items-center gap-4 text-white">
                       <Database className="w-6 h-6 text-white" /> Variables de Déploiement
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Nom du Site</label>
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-white/20 outline-none transition-all font-black text-sm text-white placeholder:text-slate-800"
                            value={config.site_name}
                            onChange={e => setConfig({...config, site_name: e.target.value})}
                            placeholder="BENZ AUTO DZ"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Email de Contact</label>
                          <input 
                            type="email" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-white/20 outline-none transition-all font-black text-sm text-white placeholder:text-slate-800"
                            value={config.contact_email}
                            onChange={e => setConfig({...config, contact_email: e.target.value})}
                            placeholder="admin@benzauto.dz"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Téléphone</label>
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-white/20 outline-none transition-all font-black text-sm text-white placeholder:text-slate-800"
                            value={config.contact_phone}
                            onChange={e => setConfig({...config, contact_phone: e.target.value})}
                            placeholder="+213 5XX XX XX XX"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Adresse Siège</label>
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-white/20 outline-none transition-all font-black text-sm text-white placeholder:text-slate-800"
                            value={config.address}
                            onChange={e => setConfig({...config, address: e.target.value})}
                            placeholder="Alger, Algérie"
                          />
                       </div>
                    </div>
                    <div className="mt-10 pt-10 border-t border-white/5">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                          <Smartphone className="w-4 h-4" /> Réseaux Sociaux
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-white/20 outline-none transition-all font-black text-xs text-white placeholder:text-slate-800"
                            value={config.facebook_url}
                            onChange={e => setConfig({...config, facebook_url: e.target.value})}
                            placeholder="Facebook URL"
                          />
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-white/20 outline-none transition-all font-black text-xs text-white placeholder:text-slate-800"
                            value={config.instagram_url}
                            onChange={e => setConfig({...config, instagram_url: e.target.value})}
                            placeholder="Instagram URL"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Sidebar Diagnostics */}
              <div className="space-y-6">
                 <div className="p-10 rounded-[3rem] bg-linear-to-br from-white/5 to-transparent border border-white/5 shadow-2xl relative overflow-hidden">
                    <h3 className="font-heading font-black text-xl mb-10 text-white italic uppercase tracking-tighter flex items-center gap-4">
                       <Cpu className="w-6 h-6 text-white" /> Diagnostics
                    </h3>
                    <div className="space-y-6">
                       <div className="p-6 rounded-3xl bg-white/2 border border-white/5 group">
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Allocation Mémoire</span>
                             <span className="text-[10px] font-black text-white">84% Load</span>
                          </div>
                          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                             <div className="h-full bg-white w-[84%] animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                          </div>
                       </div>
                       <div className="p-6 rounded-3xl bg-white/2 border border-white/5 group">
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cache Stockage</span>
                             <span className="text-[10px] font-black text-white">Optimal</span>
                          </div>
                          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                             <div className="h-full bg-white/20 w-[45%]"></div>
                          </div>
                       </div>
                    </div>
                    <div className="mt-12 flex items-center gap-4 p-5 rounded-2xl bg-surface/80 border border-white/5">
                       <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-pulse"></div>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dernière Synchro il y a 2 min</p>
                    </div>
                 </div>

                 <div className="p-10 rounded-[3rem] bg-surface/40 backdrop-blur-3xl border border-white/5 shadow-2xl group">
                    <h3 className="font-heading font-black text-xl mb-6 text-white italic uppercase tracking-tighter flex items-center gap-4">
                       <ShieldCheck className="w-6 h-6 text-white" /> Intégrité
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">
                       Les protocoles de sécurité sont mis à jour automatiquement. Des sauvegardes chiffrées sont générées toutes les 6 heures.
                    </p>
                    <button className="w-full py-5 rounded-2xl bg-white/3 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all">
                       Télécharger Log d'Audit
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x { animation: bounce-x 1s infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
