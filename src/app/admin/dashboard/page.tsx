"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Video,
  MessageSquare,
  Tag,
  Settings,
  Eye,
  LogOut,
  TrendingUp,
  Car,
  Clock,
  ChevronRight,
  Activity,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Search,
  Bell,
  Cpu,
  Globe,
  Layers,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../utils/supabase/client";

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
    if (!session) {
      router.push("/admin");
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const { data: products } = await supabase.from("products").select("*");
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

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble", active: true },
    { href: "/admin/dashboard/stock", icon: Package, label: "Inventaire" },
    { href: "/admin/dashboard/clients", icon: Users, label: "Clients" },
    { href: "/admin/dashboard/videos", icon: Video, label: "Médias (Reels)" },
    { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes" },
    { href: "/admin/dashboard/promos", icon: Tag, label: "Promotions" },
    { href: "/admin/dashboard/settings", icon: Settings, label: "Paramètres" },
  ];

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
    <div className="min-h-screen bg-background text-slate-200 flex flex-col xl:flex-row p-4 md:p-6 gap-4 md:gap-6 font-sans">
      {/* Floating Glass Sidebar */}
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
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-500 group relative overflow-hidden ${
                item.active 
                  ? "bg-white/5 text-white shadow-lg" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/2"
              }`}
            >
              {item.active && <div className="absolute left-0 top-0 w-1 h-full bg-white"></div>}
              <item.icon className={`w-5 h-5 transition-all duration-500 ${item.active ? "text-white scale-110" : "group-hover:text-slate-200"}`} />
              <span className="text-sm uppercase tracking-widest">{item.label}</span>
              {item.active && <ArrowRight className="w-4 h-4 ml-auto text-white animate-bounce-x" />}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-6">
          <div className="p-6 rounded-3xl bg-surface border border-white/5 relative group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Système Actif</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Connexion sécurisée établie. État du serveur : Optimal.</p>
          </div>

          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-between px-8 py-5 rounded-3xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/3 hover:border-white/10 transition-all duration-500 group"
          >
            <span className="text-sm font-black uppercase tracking-widest">Déconnexion</span>
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="grow flex flex-col min-w-0">
        {/* Top Floating Bar */}
        <header className="min-h-28 py-6 md:py-0 bg-surface/20 border border-white/5 rounded-[2.5rem] mb-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-6 md:px-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-white/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase">Dashboard</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Centre de contrôle</p>
            </div>
          </div>

          <div className="flex items-center gap-8 relative z-10">
            <div className="hidden lg:flex items-center gap-3 bg-black/20 border border-white/5 rounded-2xl px-5 py-3 focus-within:border-white/20 transition-all group">
              <Search className="w-4 h-4 text-slate-600 group-focus-within:text-white" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent border-none text-sm focus:outline-none w-48 text-slate-300 placeholder:text-slate-700"
              />
            </div>
            
            <div className="flex items-center gap-6">
              <button className="relative p-3 rounded-2xl bg-surface border border-white/5 hover:border-white/20 transition-all group">
                <Bell className="w-5 h-5 text-slate-500 group-hover:text-white" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full ring-4 ring-surface"></span>
              </button>
              
              <Link href="/" className="p-3 rounded-2xl bg-surface border border-white/5 hover:border-white/20 transition-all text-slate-500 hover:text-white">
                <Eye className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex items-center gap-4 pl-8 border-l border-white/5">
              <div className="text-right">
                <p className="text-sm font-black text-white leading-none">ADMIN</p>
                <p className="text-[9px] text-slate-500 font-black uppercase mt-1 tracking-widest">Accès Autorisé</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface border border-white/10 flex items-center justify-center font-black text-white shadow-lg">
                B
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Grid */}
        <div className="grow overflow-y-auto custom-scrollbar pr-2">
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Stock Actif", value: stats.totalStock, icon: Package, color: "text-white", bg: "bg-white/5", sub: "Unités" },
              { label: "Disponibles", value: stats.available, icon: ShieldCheck, color: "text-white", bg: "bg-white/5", sub: "Prêts" },
              { label: "Demandes", value: stats.leads, icon: MessageSquare, color: "text-white", bg: "bg-white/5", sub: "Total" },
              { label: "Ventes", value: stats.sold, icon: TrendingUp, color: "text-white", bg: "bg-white/5", sub: "Vendus" },
            ].map((stat, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-surface/30 border border-white/5 hover:border-white/20 transition-all duration-700 relative overflow-hidden shadow-xl">
                <div className="absolute -right-8 -bottom-8 opacity-5 transition-all duration-1000 group-hover:scale-150 group-hover:rotate-12 group-hover:opacity-10">
                  <stat.icon className={`w-40 h-40 ${stat.color}`} />
                </div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} border border-white/10 shadow-lg`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/3 border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Live
                  </div>
                </div>
                <div className="relative z-10">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-5xl font-black font-heading tracking-tighter text-white">{stat.value}</h3>
                    <span className={`text-[10px] font-bold ${stat.color}`}>{stat.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
            {/* Analytics Surface */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-10 rounded-[3rem] bg-surface/40 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="flex items-center justify-between mb-12 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black font-heading flex items-center gap-4 text-white uppercase italic">
                      <Zap className="w-6 h-6 text-white" />
                      Activité du Réseau
                    </h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Flux de données en temps réel</p>
                  </div>
                  <div className="flex gap-1.5 p-1.5 bg-black/20 rounded-2xl border border-white/5">
                    {["J", "S", "M"].map(t => (
                      <button key={t} className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${t === "S" ? "bg-white text-black shadow-lg" : "text-slate-600 hover:text-slate-300"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-72 flex items-end justify-between gap-3 relative z-10">
                  {[35, 60, 40, 85, 50, 70, 45, 95, 65, 80, 55, 90].map((h, i) => (
                    <div key={i} className="grow group/bar relative h-full flex flex-col justify-end">
                      <div className="absolute inset-0 bg-white/1 rounded-2xl opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                      <div 
                        className="w-full bg-linear-to-t from-white/5 to-white/20 rounded-2xl transition-all duration-700 relative group-hover/bar:to-white/40" 
                        style={{ height: `${h}%` }}
                      >
                         <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all shadow-xl">
                           {h}%
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-8 text-[10px] text-slate-700 font-black uppercase tracking-[0.3em] px-2">
                  <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
                </div>
              </div>

              {/* Data Table Preview */}
              <div className="p-10 rounded-[3rem] bg-surface/40 backdrop-blur-xl border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black font-heading flex items-center gap-4 text-white italic uppercase tracking-tight">
                    <Layers className="w-6 h-6 text-white" />
                    Véhicules Récents
                  </h3>
                  <Link href="/admin/dashboard/stock" className="text-[10px] font-black text-white hover:text-slate-400 flex items-center gap-2 uppercase tracking-widest transition-colors group">
                    Inventaire Complet <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentVehicles.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-4xl bg-white/2 border border-white/3 hover:border-white/10 hover:bg-white/4 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0">
                          <img src={v.image_url || "https://images.unsplash.com/photo-1542362567-b05503f35259?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-xl tracking-tight text-white group-hover:text-white transition-colors">{v.name}</p>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">{v.brand} · {v.year}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black tracking-tighter text-white">{v.price}</p>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-xl mt-2 inline-block ${v.status === 'Disponible' ? 'bg-white/5 text-white border border-white/10' : 'bg-red-400/5 text-red-400 border border-red-400/10'}`}>
                          {v.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Feed */}
            <div className="space-y-6">
              <div className="p-8 rounded-[3rem] bg-surface/80 border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black font-heading mb-8 flex items-center gap-3 text-white">
                    <Clock className="w-5 h-5 text-white" />
                    Flux d'Événements
                  </h3>
                  <div className="space-y-8">
                    {recentOrders.length === 0 ? (
                      <p className="text-slate-500 text-xs text-center py-12 font-bold uppercase tracking-widest">Aucune demande active</p>
                    ) : (
                      recentOrders.map((o, i) => (
                        <div key={i} className="relative pl-8 border-l border-white/5 pb-8 last:pb-0">
                          <div className="absolute -left-[4.5px] top-0 w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse"></div>
                          <div className="bg-white/2 p-6 rounded-4xl border border-white/5 hover:border-white/10 transition-all group">
                            <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1 group-hover:text-white transition-colors">{o.customer_name}</p>
                            <p className="text-[9px] text-slate-500 font-bold mb-4 tracking-wider">{o.customer_phone}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-black text-slate-600 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 uppercase tracking-tighter">
                                {o.items_list?.substring(0, 20)}...
                              </span>
                              <span className="text-[9px] font-black text-white">{new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Link href="/admin/dashboard/inquiries" className="w-full mt-10 py-5 rounded-4xl bg-white/3 hover:bg-white/6 border border-white/5 text-center text-[10px] font-black uppercase tracking-[0.3em] transition-all block text-slate-400 hover:text-white">
                    Accéder au CRM
                  </Link>
                </div>
              </div>

              {/* Maintenance Control */}
              <div className="p-8 rounded-[3rem] bg-surface border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-3xl transition-all group-hover:scale-150 group-hover:bg-white/10"></div>
                <h3 className="font-heading font-black text-xl mb-6 text-white italic uppercase tracking-tight">Sécurité</h3>
                <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                    <span className="text-xs font-black text-white uppercase tracking-widest">Portail Ouvert</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-white/50" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-8">
                  Chiffrement de bout en bout actif. Surveillance du trafic externe.
                </p>
                <Link href="/admin/dashboard/settings" className="text-[9px] font-black text-slate-700 hover:text-white uppercase tracking-[0.2em] flex items-center gap-2 transition-colors">
                  Protocole Système <ChevronRight className="w-3 h-3" />
                </Link>
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
