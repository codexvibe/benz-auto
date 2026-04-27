"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, Users, Video, MessageSquare, Tag,
  Settings, Eye, LogOut, Save, Shield, Globe, Bell, Smartphone,
  Activity, ArrowRight, ShieldCheck, ChevronRight, Zap, RefreshCw,
  Power, Lock, Database, HardDrive, Cpu
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventory" },
  { href: "/admin/dashboard/clients", icon: Users, label: "CRM" },
  { href: "/admin/dashboard/videos", icon: Video, label: "Media" },
  { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Leads" },
  { href: "/admin/dashboard/promos", icon: Tag, label: "Offers" },
  { href: "/admin/dashboard/settings", icon: Settings, label: "System", active: true },
];

function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-full xl:w-80 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col shrink-0 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent"></div>
      <div className="flex items-center gap-4 mb-16">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#818CF8] flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.3)] rotate-3">
          <Globe className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div>
          <span className="font-heading font-black text-2xl tracking-tight text-white block">OSIRIS</span>
          <span className="text-[10px] text-[#38BDF8] font-bold uppercase tracking-[0.3em] mt-1 block">Benz Auto Core</span>
        </div>
      </div>
      <nav className="space-y-3 flex-grow">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group relative overflow-hidden ${item.active ? "bg-white/5 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]"}`}>
            {item.active && <div className="absolute left-0 top-0 w-1 h-full bg-[#38BDF8]"></div>}
            <item.icon className={`w-5 h-5 transition-all duration-500 ${item.active ? "text-[#38BDF8] scale-110" : "group-hover:text-slate-200"}`} />
            <span className="text-sm tracking-tight">{item.label}</span>
            {item.active && <ArrowRight className="w-4 h-4 ml-auto text-[#38BDF8] animate-bounce-x" />}
          </Link>
        ))}
      </nav>
      <button onClick={onLogout} className="w-full flex items-center justify-between px-8 py-5 rounded-3xl text-slate-400 hover:text-white hover:bg-red-500/10 border border-white/[0.03] hover:border-red-500/20 transition-all duration-500 group mt-auto">
        <span className="text-sm font-black uppercase tracking-widest">Disconnect</span>
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
    alert("SYSTEM CONFIGURATION UPDATED: Global variables synchronized.");
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 flex flex-col xl:flex-row p-4 md:p-6 gap-4 md:gap-6 font-sans selection:bg-[#38BDF8]/30">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-grow flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="min-h-28 py-6 md:py-0 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] mb-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-6 md:px-10 shadow-xl relative overflow-hidden shrink-0">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
              <Settings className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase italic">Kernel Protocol</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Core System Configuration</p>
            </div>
          </div>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="group relative px-12 py-5 bg-[#38BDF8] text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] hover:bg-[#0EA5E9] transition-all duration-500 flex items-center gap-4 overflow-hidden shadow-[0_20px_40px_rgba(56,189,248,0.2)] disabled:opacity-50"
          >
            <Save className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{loading ? "SYNCING..." : "COMMIT CHANGES"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </header>

        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 pb-10">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Config */}
              <div className="lg:col-span-2 space-y-6">
                 {/* Maintenance Shield */}
                 <div className={`p-10 rounded-[3.5rem] border transition-all duration-1000 relative overflow-hidden group shadow-2xl ${maintenance ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20"}`}>
                    <div className="absolute top-0 right-0 w-96 h-96 opacity-10 blur-3xl pointer-events-none transition-all duration-1000 group-hover:scale-150">
                       {maintenance ? <div className="w-full h-full bg-red-500"></div> : <div className="w-full h-full bg-emerald-500"></div>}
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                       <div className="flex items-center gap-8">
                          <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center border shadow-xl transition-all duration-1000 ${maintenance ? "bg-red-500/20 border-red-500/30 text-red-400 rotate-12" : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"}`}>
                             <Power className="w-10 h-10" />
                          </div>
                          <div>
                             <h3 className="text-3xl font-black font-heading uppercase italic tracking-tighter text-white">Maintenance Protocol</h3>
                             <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${maintenance ? "text-red-500" : "text-emerald-500"}`}>
                                {maintenance ? "GATEWAY RESTRICTED: Public access severed" : "GATEWAY ACTIVE: Public transmission operational"}
                             </p>
                          </div>
                       </div>
                       <button 
                         onClick={() => setMaintenance(!maintenance)}
                         className={`relative w-24 h-12 rounded-full transition-all duration-700 ${maintenance ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]" : "bg-slate-800"}`}
                       >
                          <div className={`absolute top-1.5 w-9 h-9 bg-white rounded-full transition-all duration-700 shadow-2xl flex items-center justify-center ${maintenance ? "left-13" : "left-1.5"}`}>
                             {maintenance ? <Lock className="w-4 h-4 text-red-500" /> : <RefreshCw className="w-4 h-4 text-slate-400 animate-spin-slow" />}
                          </div>
                       </button>
                    </div>
                 </div>

                 {/* System Fields */}
                 <div className="p-12 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <h3 className="text-xl font-black font-heading uppercase italic mb-10 flex items-center gap-4 text-white">
                       <Database className="w-6 h-6 text-[#38BDF8]" /> Deployment Variables
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Identity Hub</label>
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-[#38BDF8]/50 outline-none transition-all font-black text-sm text-white"
                            value={config.site_name}
                            onChange={e => setConfig({...config, site_name: e.target.value})}
                            placeholder="BENZ AUTO DZ"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Secure Email Endpoint</label>
                          <input 
                            type="email" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-[#38BDF8]/50 outline-none transition-all font-black text-sm text-white"
                            value={config.contact_email}
                            onChange={e => setConfig({...config, contact_email: e.target.value})}
                            placeholder="admin@benzauto.dz"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Hotline Signal</label>
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-[#38BDF8]/50 outline-none transition-all font-black text-sm text-white"
                            value={config.contact_phone}
                            onChange={e => setConfig({...config, contact_phone: e.target.value})}
                            placeholder="+213 5XX XX XX XX"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">HQ Geo-Location</label>
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-[#38BDF8]/50 outline-none transition-all font-black text-sm text-white"
                            value={config.address}
                            onChange={e => setConfig({...config, address: e.target.value})}
                            placeholder="Alger, Algérie"
                          />
                       </div>
                    </div>
                    <div className="mt-10 pt-10 border-t border-white/[0.05]">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                          <Smartphone className="w-4 h-4" /> Social Nodes
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-[#38BDF8]/50 outline-none transition-all font-black text-xs text-white"
                            value={config.facebook_url}
                            onChange={e => setConfig({...config, facebook_url: e.target.value})}
                            placeholder="Facebook URL"
                          />
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-8 focus:border-[#38BDF8]/50 outline-none transition-all font-black text-xs text-white"
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
                 <div className="p-10 rounded-[3rem] bg-gradient-to-br from-[#38BDF8]/10 to-transparent border border-white/5 shadow-2xl relative overflow-hidden">
                    <h3 className="font-heading font-black text-xl mb-10 text-white italic uppercase tracking-tighter flex items-center gap-4">
                       <Cpu className="w-6 h-6 text-[#38BDF8]" /> Diagnostics
                    </h3>
                    <div className="space-y-6">
                       <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] group">
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Memory Allocation</span>
                             <span className="text-[10px] font-black text-[#38BDF8]">84% Load</span>
                          </div>
                          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-[#38BDF8] to-indigo-500 w-[84%] animate-pulse shadow-[0_0_10px_#38BDF8]"></div>
                          </div>
                       </div>
                       <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] group">
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Storage Cache</span>
                             <span className="text-[10px] font-black text-emerald-400">Optimal</span>
                          </div>
                          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-400 w-[45%] shadow-[0_0_10px_#34d399]"></div>
                          </div>
                       </div>
                    </div>
                    <div className="mt-12 flex items-center gap-4 p-5 rounded-2xl bg-[#0F172A]/80 border border-white/[0.05]">
                       <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse"></div>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Sync Completed 2m ago</p>
                    </div>
                 </div>

                 <div className="p-10 rounded-[3rem] bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 shadow-2xl group">
                    <h3 className="font-heading font-black text-xl mb-6 text-white italic uppercase tracking-tighter flex items-center gap-4">
                       <ShieldCheck className="w-6 h-6 text-[#38BDF8]" /> Integrity
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">
                       Core security protocols are updated automatically. Encrypted backups are generated every 6 hours to redundant storage nodes.
                    </p>
                    <button className="w-full py-5 rounded-2xl bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all">
                       Download Audit Log
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
        .animate-spin-slow { animation: spin 3s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,0.2); }
      `}</style>
    </div>
  );
}
