"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car, LayoutDashboard, Video, MessageSquare, Settings, Eye, LogOut,
  Users, Tag, Package, Search, Phone, Calendar, CheckCircle2, XCircle,
  Globe, ArrowRight, Activity, Clock, Layers, Filter, Sparkles, ChevronRight,
  TrendingUp, Zap, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventory" },
  { href: "/admin/dashboard/clients", icon: Users, label: "CRM" },
  { href: "/admin/dashboard/videos", icon: Video, label: "Media" },
  { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Leads", active: true },
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
          <span className="font-heading font-black text-2xl tracking-tighter text-white block">OSIRIS</span>
          <span className="text-[10px] text-[#38BDF8] font-black uppercase tracking-[0.3em] mt-1 block">Benz Auto Core</span>
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

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setInquiries(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) {
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  const pendingCount = inquiries.filter(i => i.status === 'En attente').length;
  const processedCount = inquiries.filter(i => i.status === 'Traité').length;

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 flex flex-col xl:flex-row p-4 md:p-6 gap-4 md:gap-6 font-sans selection:bg-[#38BDF8]/30">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-grow flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="min-h-28 py-6 md:py-0 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] mb-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-6 md:px-10 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase italic">Signal Stream</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Live Inbound Communication</p>
            </div>
          </div>
          <div className="flex items-center gap-6 relative z-10">
             <div className="flex items-center gap-3 bg-emerald-400/5 px-6 py-3 rounded-2xl border border-emerald-400/10 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">System Link Active</span>
             </div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 pb-10">
           {/* Analytic Sensors */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-10 rounded-[3rem] bg-[#0F172A]/40 backdrop-blur-xl border border-white/[0.05] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Total Inbound</p>
                 <div className="flex items-center justify-between">
                    <h3 className="text-5xl font-black font-heading tracking-tighter text-white italic">{inquiries.length}</h3>
                    <TrendingUp className="w-8 h-8 text-slate-700 group-hover:text-[#38BDF8] transition-colors" />
                 </div>
              </div>
              <div className="p-10 rounded-[3rem] bg-amber-400/5 border border-amber-400/10 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/60 mb-4">Awaiting Signal</p>
                 <div className="flex items-center justify-between">
                    <h3 className="text-5xl font-black font-heading tracking-tighter text-amber-500 italic">{pendingCount}</h3>
                    <Clock className="w-8 h-8 text-amber-400/20 group-hover:text-amber-400 transition-colors animate-pulse" />
                 </div>
              </div>
              <div className="p-10 rounded-[3rem] bg-emerald-400/5 border border-emerald-400/10 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60 mb-4">Resolved Node</p>
                 <div className="flex items-center justify-between">
                    <h3 className="text-5xl font-black font-heading tracking-tighter text-emerald-400 italic">{processedCount}</h3>
                    <CheckCircle2 className="w-8 h-8 text-emerald-400/20 group-hover:text-emerald-400 transition-colors" />
                 </div>
              </div>
           </div>

           <div className="bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="overflow-x-auto custom-scrollbar">
                 <table className="w-full border-collapse">
                    <thead>
                       <tr className="bg-white/[0.02] text-left">
                          <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/[0.05]">Entity Identity</th>
                          <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/[0.05]">Inbound Context</th>
                          <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/[0.05]">Protocol Status</th>
                          <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/[0.05] text-right">Ops Override</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                       {loading ? (
                         <tr><td colSpan={4} className="py-32 text-center animate-pulse"><div className="w-12 h-12 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                       ) : inquiries.length === 0 ? (
                         <tr><td colSpan={4} className="py-32 text-center text-slate-700 font-black uppercase tracking-widest italic text-xs">No signals detected in local buffer</td></tr>
                       ) : (
                         inquiries.map((inq) => (
                           <tr key={inq.id} className="hover:bg-white/[0.01] transition-all group">
                              <td className="px-10 py-10">
                                 <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[1.8rem] bg-slate-900 border border-white/[0.05] flex items-center justify-center font-black text-2xl text-slate-600 shadow-xl group-hover:bg-[#38BDF8] group-hover:text-white group-hover:scale-110 transition-all duration-700 group-hover:rotate-6">
                                       {inq.customer_name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                       <p className="font-black text-2xl tracking-tighter text-white group-hover:text-[#38BDF8] transition-colors italic uppercase">{inq.customer_name}</p>
                                       <div className="flex items-center gap-3 mt-2">
                                          <Phone className="w-3.5 h-3.5 text-slate-700 group-hover:text-[#38BDF8]/60 transition-colors" />
                                          <p className="text-[10px] text-slate-600 font-black tracking-widest uppercase">{inq.customer_phone}</p>
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-10">
                                 <div className="space-y-2">
                                    <p className="font-black text-sm tracking-tight text-white/80 line-clamp-1 italic uppercase group-hover:text-white transition-colors">{inq.items_list || "Unclassified Inquiry"}</p>
                                    <div className="flex items-center gap-3">
                                       <Clock className="w-3.5 h-3.5 text-slate-700" />
                                       <p className="text-[10px] text-slate-600 font-black tracking-widest uppercase">{new Date(inq.created_at).toLocaleDateString()} @ {new Date(inq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-10">
                                 <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                                    inq.status === 'Traité' ? 'bg-emerald-400/5 text-emerald-400 border-emerald-400/10' : 
                                    inq.status === 'Annulé' ? 'bg-red-400/5 text-red-400 border-red-400/10' :
                                    'bg-amber-400/5 text-amber-400 border-amber-400/10'
                                 }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${inq.status === 'Traité' ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : inq.status === 'Annulé' ? 'bg-red-400 shadow-[0_0_10px_#f87171]' : 'bg-amber-400 shadow-[0_0_10px_#fbbf24] animate-pulse'}`} />
                                    {inq.status}
                                 </div>
                              </td>
                              <td className="px-10 py-10 text-right">
                                 <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                    <button 
                                      onClick={() => handleStatusUpdate(inq.id, 'Traité')}
                                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-emerald-500/50 hover:text-emerald-400 transition-all shadow-2xl"
                                      title="Validate Protocol"
                                    >
                                       <CheckCircle2 className="w-6 h-6" />
                                    </button>
                                    <button 
                                      onClick={() => handleStatusUpdate(inq.id, 'Annulé')}
                                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-red-500/50 hover:text-red-400 transition-all shadow-2xl"
                                      title="Void Transmission"
                                    >
                                       <XCircle className="w-6 h-6" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
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
