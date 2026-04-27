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
  { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes" },
  { href: "/admin/dashboard/promos", icon: Tag, label: "Promotions" },
  { href: "/admin/dashboard/settings", icon: Settings, label: "Paramètres" },
];

function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-full xl:w-72 bg-surface border border-white/5 rounded-3xl p-6 flex flex-col shrink-0 shadow-2xl">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="font-black text-lg text-white block uppercase tracking-widest">BENZ AUTO</span>
          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em]">Espace Admin</span>
        </div>
      </div>
      <nav className="space-y-1 grow">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest relative ${item.active ? "bg-white/5 text-white" : "text-slate-600 hover:text-white hover:bg-white/3"}`}>
            {item.active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />}
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
            {item.active && <ArrowRight className="w-3 h-3 ml-auto" />}
          </Link>
        ))}
      </nav>
      <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest mt-4 border border-white/5">
        <LogOut className="w-4 h-4" /> Déconnexion
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
    <div className="min-h-screen bg-background text-slate-200 flex flex-col xl:flex-row p-4 gap-4 font-sans">
      <Sidebar onLogout={handleLogout} />
      <main className="grow flex flex-col min-w-0 gap-4">
        <header className="bg-surface border border-white/5 rounded-3xl px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 relative z-10">
             <Link href="/admin/dashboard/stock" className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                <ChevronLeft className="w-5 h-5 text-white" />
             </Link>
             <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">Ajouter un véhicule</h1>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] mt-0.5">Remplissez les informations ci-dessous</p>
             </div>
          </div>
        </header>

        <div className="grow overflow-y-auto pr-2 custom-scrollbar">
           {error && (
             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3 text-xs font-bold">
                <AlertCircle className="w-5 h-5" />
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
