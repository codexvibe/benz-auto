"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car, LayoutDashboard, Video, MessageSquare, Settings, Eye, LogOut,
  Users, TrendingUp, Package, Clock, Star, BarChart2, ArrowUpRight,
  ShoppingBag, Activity, Tag
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../utils/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    soldVehicles: 0,
    pendingOrders: 0,
    totalOrders: 0,
    featuredVehicles: 0,
  });
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [productsRes, ordersRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    ]);

    const products = productsRes.data || [];
    const orders = ordersRes.data || [];

    setVehicles(products.slice(0, 5));
    setRecentOrders(orders);
    setStats({
      totalVehicles: products.length,
      availableVehicles: products.filter(p => p.status === "Disponible").length,
      soldVehicles: products.filter(p => p.status === "Vendu").length,
      pendingOrders: orders.filter(o => o.status === "En attente").length,
      totalOrders: orders.length,
      featuredVehicles: products.filter(p => p.is_featured).length,
    });
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de Bord", active: true },
    { href: "/admin/dashboard/stock", icon: Package, label: "Stock" },
    { href: "/admin/dashboard/clients", icon: Users, label: "CRM Clients" },
    { href: "/admin/dashboard/videos", icon: Video, label: "Vlogs & Tests" },
    { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes (Leads)" },
    { href: "/admin/dashboard/promos", icon: Tag, label: "Codes Promos" },
    { href: "/admin/dashboard/settings", icon: Settings, label: "Paramètres" },
    { href: "/", icon: Eye, label: "Voir le site" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#ff0000] flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">ADMIN <span className="text-[#ff0000]">BA</span></span>
        </div>

        <nav className="space-y-1 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                item.active
                  ? "bg-[#ff0000]/10 text-[#ff0000]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Tableau de Bord</h1>
            <p className="text-gray-500">Vue d'ensemble de votre activité Benz Auto DZ.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard/new"
              className="px-5 py-3 bg-[#ff0000] text-white font-bold rounded-xl hover:bg-[#cc0000] transition-all flex items-center gap-2 text-sm"
            >
              + Ajouter un véhicule
            </Link>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Stock", value: stats.totalVehicles, icon: Package, color: "blue", badge: "Tous" },
            { label: "Disponibles", value: stats.availableVehicles, icon: Activity, color: "green", badge: "Live" },
            { label: "Vendus", value: stats.soldVehicles, icon: ShoppingBag, color: "purple", badge: "Sold" },
            { label: "En Vedette", value: stats.featuredVehicles, icon: Star, color: "yellow", badge: "Top" },
            { label: "Total Leads", value: stats.totalOrders, icon: TrendingUp, color: "red", badge: "CRM" },
            { label: "En Attente", value: stats.pendingOrders, icon: Clock, color: "orange", badge: "Urgent" },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-dark p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg bg-${kpi.color}-500/10 flex items-center justify-center text-${kpi.color}-500`}>
                  <kpi.icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold text-${kpi.color}-500 bg-${kpi.color}-500/10 px-2 py-0.5 rounded-md`}>{kpi.badge}</span>
              </div>
              <div>
                <div className="text-2xl font-bold">{loading ? "—" : kpi.value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{kpi.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Bar Chart (CSS Only) */}
        <div className="glass-dark rounded-2xl border border-white/5 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#ff0000]" />
                Activité des Leads (7 derniers jours)
              </h2>
              <p className="text-gray-500 text-sm mt-1">Demandes reçues par jour</p>
            </div>
          </div>
          <div className="flex items-end gap-3 h-32">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => {
              const heights = [40, 70, 55, 90, 65, 85, 45];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-[#ff0000]/80 to-[#ff0000]/20 transition-all duration-700 hover:from-[#ff0000] hover:to-[#ff6060]/40"
                    style={{ height: `${heights[i]}%` }}
                  />
                  <span className="text-[10px] text-gray-500">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout: Recent Vehicles + Recent Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Vehicles */}
          <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-bold">Derniers Véhicules</h2>
              <Link href="/admin/dashboard" className="text-[#ff0000] text-xs hover:underline flex items-center gap-1">
                Voir tout <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {loading ? (
                <div className="px-6 py-8 text-center text-gray-500 text-sm">Chargement...</div>
              ) : vehicles.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500 text-sm">Aucun véhicule ajouté</div>
              ) : (
                vehicles.map((v) => (
                  <div key={v.id} className="px-6 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-gray-900 overflow-hidden border border-white/5 shrink-0">
                      {v.image_url && <img src={v.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-medium text-sm truncate">{v.name}</div>
                      <div className="text-xs text-gray-500">{v.category} · {v.year}</div>
                    </div>
                    <div className="shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                        v.status === "Disponible" ? "bg-green-500/10 text-green-400" :
                        v.status === "Vendu" ? "bg-red-500/10 text-red-400" :
                        "bg-gray-500/10 text-gray-400"
                      }`}>{v.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Leads */}
          <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-bold">Derniers Leads</h2>
              <Link href="/admin/dashboard/inquiries" className="text-[#ff0000] text-xs hover:underline flex items-center gap-1">
                Voir tout <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {loading ? (
                <div className="px-6 py-8 text-center text-gray-500 text-sm">Chargement...</div>
              ) : recentOrders.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500 text-sm">Aucune demande reçue</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="px-6 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#ff0000]/10 flex items-center justify-center text-[#ff0000] font-bold text-xs shrink-0">
                      {order.customer_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-medium text-sm truncate">{order.customer_name}</div>
                      <div className="text-xs text-gray-500 truncate">{order.items_list || "Demande générale"}</div>
                    </div>
                    <div className="shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                        order.status === "En attente" ? "bg-yellow-500/10 text-yellow-400" :
                        order.status === "Traité" ? "bg-green-500/10 text-green-400" :
                        "bg-gray-500/10 text-gray-400"
                      }`}>{order.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
