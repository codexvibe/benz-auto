"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car, LayoutDashboard, Video, MessageSquare, Settings, Eye, LogOut,
  Users, Tag, Plus, Trash2, ToggleLeft, ToggleRight, CheckCircle2,
  Package, Zap, Percent, Calendar, Gift, Sparkles, ChevronRight,
  Globe, ArrowRight, Activity, Layers, ArrowUpRight, MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventory" },
  { href: "/admin/dashboard/clients", icon: Users, label: "CRM" },
  { href: "/admin/dashboard/videos", icon: Video, label: "Media" },
  { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Leads" },
  { href: "/admin/dashboard/promos", icon: Tag, label: "Offers", active: true },
  { href: "/admin/dashboard/settings", icon: Settings, label: "System" },
];

function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-80 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col shrink-0 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#38BDF8] to-transparent"></div>
      <div className="flex items-center gap-4 mb-16">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#38BDF8] to-[#818CF8] flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.3)] rotate-3">
          <Globe className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div>
          <span className="font-heading font-black text-2xl tracking-tighter text-white block">OSIRIS</span>
          <span className="text-[10px] text-[#38BDF8] font-black uppercase tracking-[0.3em] mt-1 block">Benz Auto Core</span>
        </div>
      </div>
      <nav className="space-y-3 grow">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-500 group relative overflow-hidden ${item.active ? "bg-white/5 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/2"}`}>
            {item.active && <div className="absolute left-0 top-0 w-1 h-full bg-[#38BDF8]"></div>}
            <item.icon className={`w-5 h-5 transition-all duration-500 ${item.active ? "text-[#38BDF8] scale-110" : "group-hover:text-slate-200"}`} />
            <span className="text-sm tracking-tight">{item.label}</span>
            {item.active && <ArrowRight className="w-4 h-4 ml-auto text-[#38BDF8] animate-bounce-x" />}
          </Link>
        ))}
      </nav>
      <button onClick={onLogout} className="w-full flex items-center justify-between px-8 py-5 rounded-3xl text-slate-400 hover:text-white hover:bg-red-500/10 border border-white/3 hover:border-red-500/20 transition-all duration-500 group mt-auto">
        <span className="text-sm font-black uppercase tracking-widest">Disconnect</span>
        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </aside>
  );
}

export default function PromosPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount_amount: "",
    discount_type: "percentage",
    expires_at: "",
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setLoading(true);
    const { data } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    setPromos(data || []);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.discount_amount) return;
    setSaving(true);
    const { error } = await supabase.from("promo_codes").insert([{
      code: form.code.toUpperCase(),
      discount_amount: form.discount_amount,
      discount_type: form.discount_type,
      expires_at: form.expires_at || null,
      is_active: true,
    }]);
    if (!error) {
      setForm({ code: "", discount_amount: "", discount_type: "percentage", expires_at: "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchPromos();
    }
    setSaving(false);
  };

  const togglePromo = async (id: number, current: boolean) => {
    await supabase.from("promo_codes").update({ is_active: !current }).eq("id", id);
    fetchPromos();
  };

  const deletePromo = async (id: number) => {
    if (!confirm("🚨 CAMPAIGN TERMINATION: Proceed with absolute deletion?")) return;
    await supabase.from("promo_codes").delete().eq("id", id);
    fetchPromos();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 flex p-6 gap-6 font-sans selection:bg-[#38BDF8]/30">
      <Sidebar onLogout={handleLogout} />

      <main className="grow flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-28 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] mb-6 flex items-center justify-between px-10 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center">
              <Tag className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase italic">Marketing Vectors</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Campaign Matrix & Codes</p>
            </div>
          </div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="px-6 py-3 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[10px] font-black text-[#38BDF8] uppercase tracking-widest flex items-center gap-4 shadow-xl">
                <Sparkles className="w-4 h-4" /> {promos.length} ACTIVE VECTORS
             </div>
          </div>
        </header>

        <div className="grow overflow-y-auto custom-scrollbar pr-2">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Campaign Creator Surface */}
              <div className="lg:col-span-1">
                 <form onSubmit={handleCreate} className="p-10 rounded-[3rem] bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#38BDF8] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4 mb-10">
                       <Zap className="w-6 h-6 text-[#38BDF8] animate-pulse" />
                       <h3 className="text-2xl font-black font-heading uppercase italic text-white tracking-tight">Initiate Code</h3>
                    </div>

                    <div className="space-y-8">
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Redemption String</label>
                          <input
                            type="text"
                            placeholder="EX: ALPHA-2026"
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-6 px-8 focus:border-[#38BDF8]/50 outline-none transition-all font-mono text-xl font-black tracking-[0.3em] uppercase text-white placeholder:text-slate-800 shadow-inner"
                            value={form.code}
                            onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                            required
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Value</label>
                             <div className="relative">
                                <Percent className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                <input
                                  type="text"
                                  placeholder="25"
                                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-6 px-8 focus:border-[#38BDF8]/50 outline-none transition-all font-black text-xl text-white shadow-inner"
                                  value={form.discount_amount}
                                  onChange={e => setForm({ ...form, discount_amount: e.target.value })}
                                  required
                                />
                             </div>
                          </div>
                          <div>
                             <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Logic</label>
                             <select
                               className="w-full bg-black/40 border border-white/5 rounded-2xl py-6 px-8 focus:border-[#38BDF8]/50 outline-none transition-all font-black text-xs text-white appearance-none cursor-pointer shadow-inner"
                               value={form.discount_type}
                               onChange={e => setForm({ ...form, discount_type: e.target.value })}
                             >
                                <option value="percentage">Ratio (%)</option>
                                <option value="fixed">Fixed (DA)</option>
                             </select>
                          </div>
                       </div>

                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Termination Date</label>
                          <div className="relative">
                             <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 pointer-events-none" />
                             <input
                               type="date"
                               className="w-full bg-black/40 border border-white/5 rounded-2xl py-6 pl-16 pr-8 focus:border-[#38BDF8]/50 outline-none transition-all font-black text-xs text-white shadow-inner"
                               value={form.expires_at}
                               onChange={e => setForm({ ...form, expires_at: e.target.value })}
                             />
                          </div>
                       </div>

                       <button
                         type="submit"
                         disabled={saving}
                         className="w-full group relative py-6 bg-[#38BDF8] text-white font-black text-xs uppercase tracking-[0.3em] rounded-4xl hover:bg-[#0EA5E9] transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden shadow-[0_20px_40px_rgba(56,189,248,0.2)] disabled:opacity-50 mt-4"
                       >
                          <ArrowUpRight className="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          <span className="relative z-10">{saving ? "PROCESSING..." : "ACTIVATE VECTOR"}</span>
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                       </button>
                       {saved && (
                         <div className="flex items-center justify-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-4 animate-bounce">
                            <CheckCircle2 className="w-5 h-5" /> Campaign Successfully Deployed
                         </div>
                       )}
                    </div>
                 </form>
              </div>

              {/* Vector Matrix Surface */}
              <div className="lg:col-span-2 space-y-6">
                 <div className="bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative min-h-125 flex flex-col">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="p-10 border-b border-white/5 flex items-center justify-between">
                       <h3 className="font-black text-2xl font-heading uppercase italic tracking-tighter flex items-center gap-4 text-white">
                          <Layers className="w-6 h-6 text-[#38BDF8]" /> Active Marketing Matrix
                       </h3>
                    </div>

                    <div className="overflow-x-auto grow custom-scrollbar">
                       <table className="w-full border-collapse">
                          <thead>
                             <tr className="bg-white/2 text-left">
                                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Redemption Link</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Valuation</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Termination</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Status Feed</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Ops Control</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/3">
                             {loading ? (
                               <tr><td colSpan={5} className="py-32 text-center animate-pulse"><div className="w-12 h-12 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                             ) : promos.length === 0 ? (
                               <tr><td colSpan={5} className="py-32 text-center text-slate-700 font-black uppercase tracking-widest italic text-xs">No marketing vectors registered in cluster</td></tr>
                             ) : (
                               promos.map((p) => (
                                 <tr key={p.id} className="hover:bg-white/1 transition-all group">
                                    <td className="px-10 py-8">
                                       <div className="flex items-center gap-6">
                                          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-mono font-black text-[#38BDF8] text-xl border border-white/5 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                             #
                                          </div>
                                          <span className="font-mono font-black text-2xl tracking-[0.3em] text-white group-hover:text-[#38BDF8] transition-colors uppercase italic">{p.code}</span>
                                       </div>
                                    </td>
                                    <td className="px-10 py-8">
                                       <div className="flex items-baseline gap-2">
                                          <span className="text-3xl font-black tracking-tighter text-white italic">{p.discount_amount}</span>
                                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{p.discount_type === "percentage" ? "Percent" : "DZD Index"}</span>
                                       </div>
                                    </td>
                                    <td className="px-10 py-8">
                                       <div className="flex items-center gap-3 text-xs font-black text-slate-500 tracking-widest italic uppercase">
                                          <Calendar className="w-4 h-4 text-[#38BDF8]/40" />
                                          {p.expires_at ? new Date(p.expires_at).toLocaleDateString("fr-DZ") : "INDEFINITE"}
                                       </div>
                                    </td>
                                    <td className="px-10 py-8">
                                       <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border ${
                                          p.is_active ? "bg-emerald-400/5 text-emerald-400 border-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.1)]" : "bg-slate-500/5 text-slate-500 border-white/5"
                                       }`}>
                                          <div className={`w-1.5 h-1.5 rounded-full ${p.is_active ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]' : 'bg-slate-800'}`} />
                                          {p.is_active ? "TRANSMITTING" : "PAUSED"}
                                       </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                          <button
                                            onClick={() => togglePromo(p.id, p.is_active)}
                                            className={`p-4 rounded-2xl transition-all border shadow-2xl ${p.is_active ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20' : 'bg-white/3 border-white/5 text-slate-700 hover:text-white hover:bg-white/10'}`}
                                          >
                                             {p.is_active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                          </button>
                                          <button onClick={() => deletePromo(p.id)} className="p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-red-500/50 hover:text-red-400 transition-all shadow-2xl">
                                             <Trash2 className="w-6 h-6" />
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
                 </div>

                 {/* System Insight */}
                 <div className="p-10 rounded-[3rem] bg-linear-to-r from-indigo-500/10 to-[#38BDF8]/10 border border-white/5 flex items-center justify-between group shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-x-10 -translate-y-5 group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="flex items-center gap-8 relative z-10">
                       <div className="w-16 h-16 rounded-3xl bg-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] group-hover:rotate-12 transition-all duration-500 shadow-xl border border-[#38BDF8]/30">
                          <Activity className="w-8 h-8" />
                       </div>
                       <div>
                          <h4 className="font-black text-lg uppercase tracking-[0.2em] mb-2 text-white italic">Vector Intelligence</h4>
                          <p className="text-xs text-slate-500 max-w-lg leading-relaxed font-medium">Marketing codes are hashed and synchronized across all checkout nodes. High-frequency usage detected in the last 24h cycle.</p>
                       </div>
                    </div>
                    <ArrowRight className="w-8 h-8 text-slate-800 group-hover:translate-x-3 transition-all duration-500 group-hover:text-[#38BDF8]" />
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
