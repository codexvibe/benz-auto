"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car, LayoutDashboard, Video, MessageSquare, Settings, Eye, LogOut,
  Users, Tag, Plus, Trash2, ToggleLeft, ToggleRight, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

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
    if (!confirm("Supprimer ce code promo ?")) return;
    await supabase.from("promo_codes").delete().eq("id", id);
    fetchPromos();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de Bord" },
    { href: "/admin/dashboard/clients", icon: Users, label: "CRM Clients" },
    { href: "/admin/dashboard/videos", icon: Video, label: "Vlogs & Tests" },
    { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes (Leads)" },
    { href: "/admin/dashboard/promos", icon: Tag, label: "Codes Promos", active: true },
    { href: "/admin/dashboard/settings", icon: Settings, label: "Paramètres" },
    { href: "/", icon: Eye, label: "Voir le site" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#ff0000] flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">ADMIN <span className="text-[#ff0000]">BA</span></span>
        </div>
        <nav className="space-y-1 flex-grow">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${item.active ? "bg-[#ff0000]/10 text-[#ff0000]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
              <item.icon className="w-5 h-5" />{item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-auto">
          <LogOut className="w-5 h-5" />Déconnexion
        </button>
      </aside>

      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Codes Promos</h1>
          <p className="text-gray-500">Créez et gérez vos codes de réduction.</p>
        </header>

        {/* Create Form */}
        <form onSubmit={handleCreate} className="glass-dark rounded-2xl border border-white/5 p-6 mb-8">
          <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#ff0000]" /> Créer un nouveau code
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Code Promo</label>
              <input
                type="text"
                placeholder="EX: BENZ20"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#ff0000] font-mono tracking-widest transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Réduction</label>
              <input
                type="text"
                placeholder="Ex: 10"
                value={form.discount_amount}
                onChange={e => setForm({ ...form, discount_amount: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#ff0000] transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Type</label>
              <select
                value={form.discount_type}
                onChange={e => setForm({ ...form, discount_type: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#ff0000] transition-all"
              >
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (DA)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Expire le</label>
              <input
                type="date"
                value={form.expires_at}
                onChange={e => setForm({ ...form, expires_at: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#ff0000] transition-all"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#ff0000] text-white font-bold rounded-xl hover:bg-[#cc0000] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {saving ? "Création..." : "Créer le Code"}
            </button>
            {saved && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Code créé avec succès !
              </div>
            )}
          </div>
        </form>

        {/* Promos List */}
        <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-bold">Codes Actifs ({promos.length})</h2>
          </div>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Chargement...</div>
          ) : promos.length === 0 ? (
            <div className="py-12 text-center text-gray-500">Aucun code promo créé</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-widest bg-white/5">
                    <th className="px-6 py-3 font-bold">Code</th>
                    <th className="px-6 py-3 font-bold">Réduction</th>
                    <th className="px-6 py-3 font-bold">Expiration</th>
                    <th className="px-6 py-3 font-bold">Statut</th>
                    <th className="px-6 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {promos.map((promo) => (
                    <tr key={promo.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-[#ff0000] bg-[#ff0000]/10 px-3 py-1 rounded-lg">{promo.code}</span>
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {promo.discount_amount}{promo.discount_type === "percentage" ? "%" : " DA"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString("fr-DZ") : "Sans expiration"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${promo.is_active ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-500"}`}>
                          {promo.is_active ? "Actif" : "Désactivé"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => togglePromo(promo.id, promo.is_active)}
                            className={`p-2 rounded-lg transition-all ${promo.is_active ? "text-green-400 hover:bg-green-500/10" : "text-gray-600 hover:bg-white/5"}`}
                          >
                            {promo.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </button>
                          <button onClick={() => deletePromo(promo.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
