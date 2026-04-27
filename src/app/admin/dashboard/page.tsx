"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, MessageSquare, Tag, Settings,
  LogOut, TrendingUp, Car, Clock, ChevronRight, Activity,
  ShieldCheck, Search, Bell, Eye, ArrowRight, Layers
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../utils/supabase/client";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble", active: true },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventaire" },
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

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStock: 0,
    available: 0,
    sold: 0,
    featured: 0,
    leads: 0,
    pending: 0
  });
  const [recentVehicles, setRecentVehicles] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    setLoading(true);
    const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5);

    if (products) {
      setStats({
        totalStock: products.length,
        available: products.filter(p => p.status === "Disponible").length,
        sold: products.filter(p => p.status === "Vendu").length,
        featured: products.filter(p => p.is_featured).length,
        leads: orders?.length || 0,
        pending: orders?.filter(o => o.status === "En attente").length || 0
      });
      setRecentVehicles(products.slice(0, 5));
    }
    if (orders) setRecentOrders(orders);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
          <Car className="w-8 h-8 text-white absolute inset-0 m-auto animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-200 flex flex-col xl:flex-row p-4 gap-4 font-sans">
      <Sidebar onLogout={handleLogout} />

      <main className="grow flex flex-col min-w-0 gap-4">
        <header className="bg-surface border border-white/5 rounded-3xl px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Dashboard</h1>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] mt-0.5">Centre de contrôle principal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard/inquiries" className="relative p-3 rounded-xl bg-surface border border-white/5 hover:bg-white/5 transition-all group">
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              {stats.pending > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center">
                  {stats.pending}
                </span>
              )}
            </Link>
            
            <Link href="/admin/dashboard/settings" className="p-3 rounded-xl bg-surface border border-white/5 hover:bg-white/5 transition-all group">
              <Settings className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </Link>

            <Link href="/" target="_blank" className="p-3 rounded-xl bg-surface border border-white/5 hover:bg-white/5 transition-all text-slate-400 hover:text-white">
              <Eye className="w-5 h-5" />
            </Link>
          </div>
        </header>

        <div className="grow overflow-y-auto custom-scrollbar pr-2 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { label: "Stock Total", value: stats.totalStock, icon: Package },
              { label: "Disponibles", value: stats.available, icon: ShieldCheck },
              { label: "Vendus", value: stats.sold, icon: TrendingUp },
              { label: "Demandes", value: stats.leads, icon: MessageSquare },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-3xl bg-surface border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            
            <div className="xl:col-span-2 bg-surface border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest">
                  <Layers className="w-4 h-4 text-slate-400" /> Véhicules Récents
                </h3>
                <Link href="/admin/dashboard/stock" className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                  Voir tout <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentVehicles.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:bg-white/1.5 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 relative">
                        {v.image_url ? (
                          <img src={v.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Car className="w-5 h-5 text-slate-600 absolute inset-0 m-auto" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{v.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{v.brand} • {v.year}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-white">{v.price}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 inline-block ${v.status === 'Disponible' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                        {v.status}
                      </span>
                    </div>
                  </div>
                ))}
                {recentVehicles.length === 0 && (
                  <div className="text-center py-10 text-xs font-bold text-slate-600 uppercase tracking-widest">
                    Aucun véhicule
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-surface border border-white/5 rounded-3xl p-6">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest mb-6">
                  <Clock className="w-4 h-4 text-slate-400" /> Dernières demandes
                </h3>
                <div className="space-y-4">
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-xs font-bold text-slate-600 uppercase tracking-widest">
                      Aucune demande
                    </div>
                  ) : (
                    recentOrders.map((o, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-white/5 bg-white/1.5">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-black text-white uppercase">{o.customer_name}</p>
                          <span className="text-[9px] font-black text-slate-500">
                            {new Date(o.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mb-2">{o.customer_phone}</p>
                        <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                          {o.items_list}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-surface border border-white/5 rounded-3xl p-6">
                 <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest mb-4">
                  <ShieldCheck className="w-4 h-4 text-slate-400" /> Système
                </h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">En ligne</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold">Base de données OK</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
