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
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview", active: true },
    { href: "/admin/dashboard/stock", icon: Package, label: "Inventory" },
    { href: "/admin/dashboard/clients", icon: Users, label: "CRM" },
    { href: "/admin/dashboard/videos", icon: Video, label: "Media" },
    { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Leads" },
    { href: "/admin/dashboard/promos", icon: Tag, label: "Offers" },
    { href: "/admin/dashboard/settings", icon: Settings, label: "System" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-[#38BDF8]/20 border-t-[#38BDF8] rounded-full animate-spin"></div>
          <Cpu className="w-8 h-8 text-[#38BDF8] absolute inset-0 m-auto animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 flex p-6 gap-6 font-sans selection:bg-[#38BDF8]/30">
      {/* Floating Glass Sidebar */}
      <aside className="w-80 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col shrink-0 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent"></div>
        
        <div className="flex items-center gap-4 mb-16">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#818CF8] flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.3)] rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <Globe className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-heading font-black text-2xl tracking-tight text-white block">OSIRIS</span>
            <span className="text-[10px] text-[#38BDF8] font-bold uppercase tracking-[0.3em] mt-1 block">Benz Auto Core</span>
          </div>
        </div>

        <nav className="space-y-3 flex-grow">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-500 group relative overflow-hidden ${
                item.active 
                  ? "bg-white/5 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)]" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]"
              }`}
            >
              {item.active && <div className="absolute left-0 top-0 w-1 h-full bg-[#38BDF8]"></div>}
              <item.icon className={`w-5 h-5 transition-all duration-500 ${item.active ? "text-[#38BDF8] scale-110" : "group-hover:text-slate-200"}`} />
              <span className="text-sm tracking-tight">{item.label}</span>
              {item.active && <ArrowRight className="w-4 h-4 ml-auto text-[#38BDF8] animate-bounce-x" />}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] relative group cursor-help">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Node Alpha-1</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Encrypted connection active. System status optimal.</p>
          </div>

          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-between px-8 py-5 rounded-3xl text-slate-400 hover:text-white hover:bg-red-500/10 border border-white/[0.03] hover:border-red-500/20 transition-all duration-500 group"
          >
            <span className="text-sm font-black uppercase tracking-widest">Disconnect</span>
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Top Floating Bar */}
        <header className="h-28 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] mb-6 flex items-center justify-between px-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8]/5 rounded-full blur-[80px]"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase italic">Global Intelligence</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Real-time Command Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-8 relative z-10">
            <div className="hidden lg:flex items-center gap-3 bg-black/20 border border-white/[0.05] rounded-2xl px-5 py-3 focus-within:border-[#38BDF8]/50 transition-all group">
              <Search className="w-4 h-4 text-slate-600 group-focus-within:text-[#38BDF8]" />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="bg-transparent border-none text-sm focus:outline-none w-48 text-slate-300 placeholder:text-slate-700"
              />
            </div>
            
            <div className="flex items-center gap-6">
              <button className="relative p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-[#38BDF8]/30 transition-all group">
                <Bell className="w-5 h-5 text-slate-500 group-hover:text-white" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#38BDF8] rounded-full ring-4 ring-[#0F172A]"></span>
              </button>
              
              <Link href="/" className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-cyan-500/30 transition-all text-slate-500 hover:text-white">
                <Eye className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex items-center gap-4 pl-8 border-l border-white/5">
              <div className="text-right">
                <p className="text-sm font-black text-white leading-none">COMMANDER</p>
                <p className="text-[9px] text-[#38BDF8] font-black uppercase mt-1 tracking-widest">Authorized Access</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-black text-[#38BDF8] shadow-lg">
                Z
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Grid */}
        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Active Inventory", value: stats.totalStock, icon: Package, color: "text-[#38BDF8]", bg: "bg-[#38BDF8]/10", sub: "Units in DB" },
              { label: "Operational Flow", value: stats.available, icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10", sub: "Live Assets" },
              { label: "Client Inquiries", value: stats.leads, icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/10", sub: "Unresolved" },
              { label: "Growth Index", value: "84%", icon: TrendingUp, color: "text-indigo-400", bg: "bg-indigo-400/10", sub: "+12.5% Month" },
            ].map((stat, i) => (
              <div key={i} className="group p-8 rounded-[3rem] bg-[#0F172A]/40 backdrop-blur-xl border border-white/[0.05] hover:border-[#38BDF8]/20 transition-all duration-700 relative overflow-hidden shadow-xl">
                <div className="absolute -right-8 -bottom-8 opacity-5 transition-all duration-1000 group-hover:scale-150 group-hover:rotate-12 group-hover:opacity-10">
                  <stat.icon className={`w-40 h-40 ${stat.color}`} />
                </div>
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} border border-current/10 shadow-lg`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[10px] font-black text-slate-500 uppercase tracking-widest">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Analytics Surface */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-10 rounded-[3rem] bg-[#0F172A]/40 backdrop-blur-xl border border-white/[0.05] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#38BDF8]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="flex items-center justify-between mb-12 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black font-heading flex items-center gap-4 text-white">
                      <Zap className="w-6 h-6 text-[#38BDF8] animate-pulse" />
                      Network Performance
                    </h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Data stream analytics</p>
                  </div>
                  <div className="flex gap-1.5 p-1.5 bg-black/20 rounded-2xl border border-white/5">
                    {["D", "W", "M"].map(t => (
                      <button key={t} className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${t === "W" ? "bg-[#38BDF8] text-white shadow-lg" : "text-slate-600 hover:text-slate-300"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-72 flex items-end justify-between gap-3 relative z-10">
                  {[35, 60, 40, 85, 50, 70, 45, 95, 65, 80, 55, 90].map((h, i) => (
                    <div key={i} className="flex-grow group/bar relative h-full flex flex-col justify-end">
                      <div className="absolute inset-0 bg-white/[0.01] rounded-2xl opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                      <div 
                        className="w-full bg-gradient-to-t from-[#38BDF8]/20 to-[#38BDF8] rounded-2xl transition-all duration-700 relative" 
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
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>

              {/* Data Table Preview */}
              <div className="p-10 rounded-[3rem] bg-[#0F172A]/40 backdrop-blur-xl border border-white/[0.05] shadow-2xl">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black font-heading flex items-center gap-4 text-white italic uppercase tracking-tight">
                    <Layers className="w-6 h-6 text-[#38BDF8]" />
                    Asset Manifest
                  </h3>
                  <Link href="/admin/dashboard/stock" className="text-[10px] font-black text-[#38BDF8] hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors group">
                    Full Registry <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentVehicles.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.03] hover:border-[#38BDF8]/20 hover:bg-white/[0.04] transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0">
                          <img src={v.image_url || "https://images.unsplash.com/photo-1542362567-b05503f35259?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-xl tracking-tight text-white group-hover:text-[#38BDF8] transition-colors">{v.name}</p>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">{v.brand} · {v.year} EDITION</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black tracking-tighter text-white">{v.price}</p>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-xl mt-2 inline-block ${v.status === 'Disponible' ? 'bg-emerald-400/5 text-emerald-400 border border-emerald-400/10' : 'bg-red-400/5 text-red-400 border border-red-400/10'}`}>
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
              <div className="p-8 rounded-[3rem] bg-gradient-to-b from-[#38BDF8]/10 to-transparent border border-white/[0.05] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black font-heading mb-8 flex items-center gap-3 text-white">
                    <Clock className="w-5 h-5 text-[#38BDF8]" />
                    Event Stream
                  </h3>
                  <div className="space-y-8">
                    {recentOrders.length === 0 ? (
                      <p className="text-slate-500 text-xs text-center py-12 font-bold uppercase tracking-widest">No active transmission</p>
                    ) : (
                      recentOrders.map((o, i) => (
                        <div key={i} className="relative pl-8 border-l border-white/5 pb-8 last:pb-0">
                          <div className="absolute -left-[4.5px] top-0 w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_15px_#38BDF8] animate-pulse"></div>
                          <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/[0.05] hover:border-[#38BDF8]/20 transition-all group">
                            <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1 group-hover:text-[#38BDF8] transition-colors">{o.customer_name}</p>
                            <p className="text-[9px] text-slate-500 font-bold mb-4 tracking-wider">{o.customer_phone}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-black text-slate-600 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 uppercase tracking-tighter">
                                {o.items_list?.substring(0, 20)}...
                              </span>
                              <span className="text-[9px] font-black text-[#38BDF8]">{new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Link href="/admin/dashboard/inquiries" className="w-full mt-10 py-5 rounded-[2rem] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-center text-[10px] font-black uppercase tracking-[0.3em] transition-all block text-slate-400 hover:text-white">
                    Access CRM Node
                  </Link>
                </div>
              </div>

              {/* Maintenance Control */}
              <div className="p-8 rounded-[3rem] bg-[#0F172A]/80 border border-white/[0.05] shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#38BDF8]/10 rounded-full blur-3xl transition-all group-hover:scale-150 group-hover:bg-[#38BDF8]/20"></div>
                <h3 className="font-heading font-black text-xl mb-6 text-white italic uppercase tracking-tight">Security Layer</h3>
                <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-400/5 border border-emerald-400/10 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]"></div>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Gateway Open</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-400/50" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-8">
                  End-to-end encryption active. Firewall monitoring external traffic.
                </p>
                <Link href="/admin/dashboard/settings" className="text-[9px] font-black text-slate-700 hover:text-[#38BDF8] uppercase tracking-[0.2em] flex items-center gap-2 transition-colors">
                  System Protocol <ChevronRight className="w-3 h-3" />
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,0.2); }
      `}</style>
    </div>
  );
}
