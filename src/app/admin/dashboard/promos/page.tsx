"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tag, Percent, Calendar, ToggleLeft, ToggleRight,
  Trash2, Plus, Sparkles
} from "lucide-react";
import { createClient } from "../../../../utils/supabase/client";
import { Sidebar } from "../../../../components/Admin/Sidebar";

export default function PromosPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      fetchPromos();
    }
    setSaving(false);
  };

  const togglePromo = async (id: number, current: boolean) => {
    await supabase.from("promo_codes").update({ is_active: !current }).eq("id", id);
    fetchPromos();
  };

  const deletePromo = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette promotion ?")) return;
    await supabase.from("promo_codes").delete().eq("id", id);
    fetchPromos();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 flex flex-col xl:flex-row p-4 gap-4 font-sans">
      <Sidebar onLogout={handleLogout} />

      <main className="grow flex flex-col min-w-0 gap-4">
        <header className="bg-surface border border-white/5 rounded-3xl px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Promotions</h1>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] mt-0.5">Codes et Offres Spéciales</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> {promos.filter(p => p.is_active).length} Actives
          </div>
        </header>

        <div className="grow overflow-y-auto custom-scrollbar pr-2 pb-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            
            <div className="xl:col-span-1">
              <form onSubmit={handleCreate} className="bg-surface border border-white/5 rounded-3xl p-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Nouvelle Offre
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Code Promo</label>
                    <input
                      type="text"
                      placeholder="EX: BENZ2026"
                      className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-mono text-sm font-bold uppercase text-white"
                      value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Valeur</label>
                      <input
                        type="text"
                        placeholder="25"
                        className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                        value={form.discount_amount}
                        onChange={e => setForm({ ...form, discount_amount: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Type</label>
                      <select
                        className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white appearance-none cursor-pointer"
                        value={form.discount_type}
                        onChange={e => setForm({ ...form, discount_type: e.target.value })}
                      >
                        <option value="percentage">Ratio (%)</option>
                        <option value="fixed">Fixe (DA)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Date d'Expiration</label>
                    <input
                      type="date"
                      className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 focus:border-white/20 outline-none transition-colors font-bold text-sm text-white"
                      value={form.expires_at}
                      onChange={e => setForm({ ...form, expires_at: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 mt-2"
                  >
                    {saving ? "Création..." : "Ajouter le code"}
                  </button>
                </div>
              </form>
            </div>

            <div className="xl:col-span-2">
              <div className="bg-surface border border-white/5 rounded-3xl overflow-hidden h-full">
                <div className="overflow-x-auto custom-scrollbar h-full">
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-white/2 text-left">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Code</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Valeur</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Expiration</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Statut</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        <tr><td colSpan={5} className="py-20 text-center"><div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto"></div></td></tr>
                      ) : promos.length === 0 ? (
                        <tr><td colSpan={5} className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Aucune promotion active</td></tr>
                      ) : (
                        promos.map((p) => (
                          <tr key={p.id} className="hover:bg-white/2 transition-colors group">
                            <td className="px-6 py-4">
                              <span className="font-mono font-bold text-sm text-white uppercase">{p.code}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-sm text-white">{p.discount_amount} {p.discount_type === "percentage" ? "%" : "DA"}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {p.expires_at ? new Date(p.expires_at).toLocaleDateString("fr-DZ") : "Aucune"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                p.is_active ? 'bg-white/10 text-white' : 'bg-slate-500/10 text-slate-500'
                              }`}>
                                {p.is_active ? "Actif" : "Inactif"}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => togglePromo(p.id, p.is_active)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors" title={p.is_active ? "Désactiver" : "Activer"}>
                                  {p.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                </button>
                                <button onClick={() => deletePromo(p.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-colors" title="Supprimer">
                                  <Trash2 className="w-4 h-4" />
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
