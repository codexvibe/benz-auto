"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, Edit2, Trash2, LogOut, Car,
  Package, LayoutDashboard, Eye, Video, MessageSquare,
  Settings, Users, Tag, Filter, ChevronRight, MoreHorizontal,
  ExternalLink, Download, ArrowUpDown, Globe, Globe2, Layers,
  Activity, ArrowRight, Grid, List as ListIcon, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventory", active: true },
  { href: "/admin/dashboard/clients", icon: Users, label: "CRM" },
  { href: "/admin/dashboard/videos", icon: Video, label: "Media" },
  { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Leads" },
  { href: "/admin/dashboard/promos", icon: Tag, label: "Offers" },
  { href: "/admin/dashboard/settings", icon: Settings, label: "System" },
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
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-500 group relative overflow-hidden ${item.active ? "bg-white/5 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]"}`}>
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

export default function StockPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setVehicles(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("🚨 PROTOCOL CRITICAL: Proceed with permanent data erasure?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  const filtered = vehicles.filter(v =>
    v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 flex flex-col xl:flex-row p-4 md:p-6 gap-4 md:gap-6 font-sans selection:bg-[#38BDF8]/30">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-grow flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="min-h-28 py-6 md:py-0 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] mb-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-6 md:px-10 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
              <Layers className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase italic">Resource Registry</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Inventory Management Grid</p>
            </div>
          </div>

          <Link href="/admin/dashboard/new" className="group relative px-10 py-5 bg-[#38BDF8] text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] hover:bg-[#0EA5E9] transition-all duration-500 flex items-center gap-3 overflow-hidden shadow-[0_0_30px_rgba(56,189,248,0.3)]">
            <Plus className="w-5 h-5 relative z-10 transition-transform group-hover:rotate-90" />
            <span className="relative z-10">Onboard Asset</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Link>
        </header>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
           <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#38BDF8] transition-colors" />
                <input
                  type="text"
                  placeholder="Scan identifier, brand, specs..."
                  className="bg-[#0F172A]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] py-5 pl-14 pr-8 text-sm focus:outline-none focus:border-[#38BDF8]/50 transition-all w-96 font-medium text-slate-300 placeholder:text-slate-700 shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-[#38BDF8]/30 transition-all text-slate-500 hover:text-[#38BDF8] flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
                <Filter className="w-4 h-4" /> Filter Stack
              </button>
           </div>

           <div className="flex items-center gap-3 bg-white/[0.02] p-2 rounded-[2rem] border border-white/[0.05]">
              <button className="px-6 py-3 rounded-2xl bg-[#38BDF8]/10 text-[#38BDF8] text-[10px] font-black uppercase tracking-widest border border-[#38BDF8]/20 shadow-xl">Data View</button>
              <button className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-300 transition-all">Visual Grid</button>
           </div>
        </div>

        {/* Table Surface */}
        <div className="bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl flex-grow flex flex-col relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="overflow-x-auto flex-grow custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-white/[0.02]">
                  <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/[0.05]">Identification</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/[0.05]">Classification</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/[0.05]">Valuation</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/[0.05]">Activity</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/[0.05] text-right">Ops Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {loading ? (
                  <tr><td colSpan={5} className="py-32 text-center animate-pulse"><div className="w-12 h-12 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-32 text-center text-slate-700 font-black uppercase tracking-widest italic text-xs">No matching records found in local cache</td></tr>
                ) : (
                  filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-white/[0.01] transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-8">
                          <div className="w-24 h-16 rounded-2xl bg-slate-900 overflow-hidden border border-white/[0.05] shrink-0 relative shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-1">
                            {v.image_url && <img src={v.image_url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />}
                            {!v.is_visible && <div className="absolute inset-0 bg-black/80 flex items-center justify-center"><Eye className="w-4 h-4 text-slate-600" /></div>}
                          </div>
                          <div>
                            <div className="font-black text-2xl tracking-tighter text-white group-hover:text-[#38BDF8] transition-colors">{v.name}</div>
                            <div className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-3">
                              <span className="text-[#38BDF8]/60">{v.brand}</span>
                              <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                              <span>{v.year} EDITION</span>
                              {v.is_featured && <ShieldCheck className="w-3 h-3 text-amber-500 ml-2" />}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-slate-300 uppercase tracking-widest">{v.category}</p>
                          <p className="text-[9px] text-slate-600 font-black uppercase tracking-tighter">{v.transmission}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="font-black text-2xl tracking-tighter text-white italic">{v.price}</div>
                        <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1 italic">{v.mileage || "0 km"} ODO</div>
                      </td>
                      <td className="px-10 py-8">
                        <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border ${
                          v.status === "Disponible" ? "bg-emerald-400/5 text-emerald-400 border-emerald-400/10" :
                          v.status === "Vendu" ? "bg-red-400/5 text-red-400 border-red-400/10" :
                          "bg-amber-400/5 text-amber-400 border-amber-400/10"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            v.status === "Disponible" ? "bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" :
                            v.status === "Vendu" ? "bg-red-400 shadow-[0_0_10px_#f87171]" :
                            "bg-amber-400 shadow-[0_0_10px_#fbbf24]"
                          }`} />
                          {v.status}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                          <button className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-[#38BDF8]/50 hover:text-[#38BDF8] transition-all shadow-xl">
                            <ExternalLink className="w-5 h-5" />
                          </button>
                          <Link href={`/admin/dashboard/edit/${v.id}`} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-indigo-500/50 hover:text-indigo-400 transition-all shadow-xl">
                            <Edit2 className="w-5 h-5" />
                          </Link>
                          <button onClick={() => handleDelete(v.id)} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-red-500/50 hover:text-red-400 transition-all shadow-xl">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <MoreHorizontal className="w-6 h-6 text-slate-800 ml-auto group-hover:hidden" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Bar */}
          <div className="p-10 border-t border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
            <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em]">Index Capacity: {filtered.length} Objects Encrypted</p>
            <div className="flex items-center gap-8">
               <button className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all"><Download className="w-5 h-5 text-slate-600" /></button>
               <div className="flex items-center gap-4">
                  <button className="w-12 h-12 rounded-2xl bg-[#38BDF8]/10 text-[#38BDF8] font-black text-xs border border-[#38BDF8]/20 shadow-2xl">01</button>
                  <button className="w-12 h-12 rounded-2xl text-slate-600 font-black text-xs hover:text-white transition-all">02</button>
                  <ChevronRight className="w-5 h-5 text-slate-800" />
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
