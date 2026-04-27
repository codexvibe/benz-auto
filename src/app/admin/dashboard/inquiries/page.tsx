"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare, TrendingUp, Clock, CheckCircle2, Phone,
  XCircle, MoreHorizontal
} from "lucide-react";
import { createClient } from "../../../../utils/supabase/client";
import { Sidebar } from "../../../../components/Admin/Sidebar";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchInquiries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className="min-h-screen bg-background text-slate-200 flex flex-col xl:flex-row p-4 gap-4 font-sans">
      <Sidebar onLogout={handleLogout} />

      <main className="grow flex flex-col min-w-0 gap-4">
        <header className="bg-surface border border-white/5 rounded-3xl px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Demandes</h1>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] mt-0.5">Communications Entrantes</p>
            </div>
          </div>
        </header>

        <div className="grow overflow-y-auto custom-scrollbar pr-2 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-6 rounded-3xl bg-surface border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Demandes</p>
                <p className="text-3xl font-black text-white">{inquiries.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-surface border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">En Attente</p>
                <p className="text-3xl font-black text-white">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-surface border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Traitées</p>
                <p className="text-3xl font-black text-white">{processedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-white/5 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white/2 text-left">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Client</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Détails</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Statut</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={4} className="py-20 text-center"><div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto"></div></td></tr>
                  ) : inquiries.length === 0 ? (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Aucune demande</td></tr>
                  ) : (
                    inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-white/2 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-sm text-white">
                              {inq.customer_name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-white uppercase">{inq.customer_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Phone className="w-3 h-3 text-slate-500" />
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest">{inq.customer_phone}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-sm text-white max-w-xs truncate">{inq.items_list || "Demande Non Classifiée"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest">
                              {new Date(inq.created_at).toLocaleDateString()} @ {new Date(inq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            inq.status === 'Traité' ? 'bg-white/10 text-white' : 
                            inq.status === 'Annulé' ? 'bg-red-500/10 text-red-400' :
                            'bg-amber-400/10 text-amber-400'
                          }`}>
                            {inq.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleStatusUpdate(inq.id, 'Traité')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors" title="Valider">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleStatusUpdate(inq.id, 'Annulé')} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-colors" title="Annuler">
                              <XCircle className="w-4 h-4" />
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
