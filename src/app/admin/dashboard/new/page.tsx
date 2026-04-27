"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Car, AlertCircle, LayoutDashboard, Package, Users,
  Video, MessageSquare, Tag, Settings, Eye, LogOut, Globe, ArrowRight,
  Layers, Plus
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";
import { VehicleForm } from "../../../../components/Admin/VehicleForm";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventaire", active: true },
  { href: "/admin/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/admin/dashboard/videos", icon: Video, label: "Médias (Reels)" },
  { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes" },
  { href: "/admin/dashboard/promos", icon: Tag, label: "Promotions" },
  { href: "/admin/dashboard/settings", icon: Settings, label: "Paramètres" },
];

function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-full xl:w-80 bg-surface/20 border border-white/5 rounded-[2.5rem] p-8 flex flex-col shrink-0 relative overflow-hidden shadow-2xl">
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

export default function NewVehiclePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) router.push("/admin");
  }, []);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    const { error } = await supabase.from("products").insert([data]);
    if (error) { setError(error.message); setLoading(false); }
    else { router.push("/admin/dashboard/stock"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 flex flex-col xl:flex-row p-4 md:p-6 gap-4 md:gap-6 font-sans">
      <Sidebar onLogout={handleLogout} />
      <main className="grow flex flex-col min-w-0">
        <header className="min-h-28 py-6 md:py-0 bg-surface/20 border border-white/5 rounded-[2.5rem] mb-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-6 md:px-10 shadow-xl relative overflow-hidden shrink-0">
          <div className="flex items-center gap-8 relative z-10">
             <Link href="/admin/dashboard/stock" className="w-14 h-14 rounded-2xl bg-surface border border-white/10 flex items-center justify-center hover:border-white/20 hover:text-white transition-all shadow-xl">
                <ChevronLeft className="w-6 h-6" />
             </Link>
             <div>
                <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase italic">Nouvel Actif</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Protocole d'Entrée Inventaire</p>
             </div>
          </div>
        </header>

        <div className="grow overflow-y-auto custom-scrollbar pr-2">
           {error && (
             <div className="mb-10 p-8 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] text-red-500 flex items-center gap-4 animate-fade-in font-black text-xs uppercase tracking-widest">
                <AlertCircle className="w-6 h-6" />
                <p>{error}</p>
             </div>
           )}
           <VehicleForm onSubmit={handleSubmit} loading={loading} />
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
