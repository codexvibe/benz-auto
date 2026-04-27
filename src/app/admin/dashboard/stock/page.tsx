"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, Edit2, Trash2, LogOut, Car, Package, LayoutDashboard,
  Video, MessageSquare, Settings, Users, Tag, ArrowRight,
  ChevronUp, ChevronDown, X, Check, Loader2, ImageIcon, Layers
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "../../../../utils/supabase/client";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventaire", active: true },
  { href: "/admin/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/admin/dashboard/videos", icon: Video, label: "Studio Contenu" },
  { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes" },
  { href: "/admin/dashboard/promos", icon: Tag, label: "Promotions" },
  { href: "/admin/dashboard/settings", icon: Settings, label: "Paramètres" },
];

type SortKey = "name" | "year" | "mileage" | "horsepower";
type SortDir = "asc" | "desc";

interface Vehicle {
  id: number;
  name: string;
  model: string;
  year: number;
  mileage: string;
  horsepower: number;
  image_url: string;
  status: string;
  category: string;
  price: string;
  brand: string;
  is_visible: boolean;
  is_featured: boolean;
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-full xl:w-72 bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex flex-col shrink-0 shadow-2xl">
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

// ─── Sort Button ──────────────────────────────────────────────────────────────
function SortBtn({ label, col, sortKey, sortDir, onSort }: {
  label: string; col: SortKey; sortKey: SortKey; sortDir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const active = sortKey === col;
  return (
    <button onClick={() => onSort(col)} className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors ${active ? "text-white" : "text-slate-600 hover:text-slate-300"}`}>
      {label}
      <span className="flex flex-col gap-px">
        <ChevronUp className={`w-2.5 h-2.5 ${active && sortDir === "asc" ? "text-white" : "text-slate-800"}`} />
        <ChevronDown className={`w-2.5 h-2.5 ${active && sortDir === "desc" ? "text-white" : "text-slate-800"}`} />
      </span>
    </button>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 max-w-sm w-full mx-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-white font-black text-xl text-center mb-2 uppercase tracking-tight">Supprimer ?</h3>
        <p className="text-slate-500 text-xs text-center mb-8 font-medium">
          «<span className="text-white font-bold"> {name} </span>» sera supprimé définitivement.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest transition-all hover:bg-white/5">
            Annuler
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all hover:bg-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StockPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // ── Auth + Fetch ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem("admin_session")) { router.push("/admin"); return; }
    fetchVehicles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id,name,model,year,mileage,horsepower,image_url,status,category,price,brand,is_visible,is_featured")
      .order("created_at", { ascending: false });
    if (!error && data) setVehicles(data as Vehicle[]);
    setLoading(false);
  };

  // ── Sort ────────────────────────────────────────────────────────────────────
  const handleSort = useCallback((key: SortKey) => {
    setSortDir(prev => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSortKey(key);
  }, [sortKey]);

  // ── Filter + Sort ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = vehicles.filter(v =>
      (!q || v.name?.toLowerCase().includes(q) || v.model?.toLowerCase().includes(q) || v.brand?.toLowerCase().includes(q)) &&
      (!yearFilter || String(v.year) === yearFilter)
    );
    result = [...result].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = typeof av === "number"
        ? (av as number) - (bv as number)
        : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [vehicles, search, yearFilter, sortKey, sortDir]);

  // ── Delete ──────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("products").delete().eq("id", deleteTarget.id);
    if (!error) {
      setVehicles(prev => prev.filter(v => v.id !== deleteTarget.id));
      showToast("Véhicule supprimé avec succès.");
    } else {
      showToast("Erreur lors de la suppression.");
    }
    setDeleteTarget(null);
    setDeleting(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const years = useMemo(() => [...new Set(vehicles.map(v => v.year).filter(Boolean))].sort((a,b)=>b-a), [vehicles]);

  return (
    <div className="min-h-screen bg-[#020202] text-slate-200 flex flex-col xl:flex-row p-4 gap-4 font-sans">
      <Sidebar onLogout={() => { localStorage.removeItem("admin_session"); router.push("/admin"); }} />

      <main className="grow flex flex-col min-w-0 gap-4">
        {/* Header */}
        <header className="bg-[#0a0a0a] border border-white/5 rounded-3xl px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Inventaire</h1>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] mt-0.5">{vehicles.length} véhicules · Gestion du stock</p>
            </div>
          </div>
          <Link href="/admin/dashboard/new"
            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all shadow-xl group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Ajouter un véhicule
          </Link>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative group grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-white transition-colors" />
            <input
              type="text" placeholder="Rechercher nom, modèle, marque..."
              className="w-full bg-[#0a0a0a] border border-white/5 focus:border-white/20 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-700 transition-all"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <select
            value={yearFilter} onChange={e => setYearFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-white/5 focus:border-white/20 rounded-xl py-3 px-4 text-xs font-bold text-slate-300 outline-none cursor-pointer transition-all"
          >
            <option value="">Toutes les années</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {(search || yearFilter) && (
            <button onClick={() => { setSearch(""); setYearFilter(""); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all hover:bg-white/5">
              <X className="w-3 h-3" /> Réinitialiser
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl grow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.015]">
                  <th className="px-6 py-5 text-left w-16">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Photo</span>
                  </th>
                  <th className="px-4 py-5 text-left">
                    <SortBtn label="Nom" col="name" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  <th className="px-4 py-5 text-left hidden md:table-cell">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Modèle</span>
                  </th>
                  <th className="px-4 py-5 text-left">
                    <SortBtn label="Année" col="year" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  <th className="px-4 py-5 text-left hidden lg:table-cell">
                    <SortBtn label="KM" col="mileage" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  <th className="px-4 py-5 text-left hidden lg:table-cell">
                    <SortBtn label="CV" col="horsepower" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  <th className="px-4 py-5 text-left hidden sm:table-cell">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Statut</span>
                  </th>
                  <th className="px-6 py-5 text-right">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5"><div className="w-14 h-10 rounded-lg bg-white/5" /></td>
                      <td className="px-4 py-5"><div className="h-4 w-32 rounded bg-white/5" /></td>
                      <td className="px-4 py-5 hidden md:table-cell"><div className="h-3 w-24 rounded bg-white/5" /></td>
                      <td className="px-4 py-5"><div className="h-3 w-12 rounded bg-white/5" /></td>
                      <td className="px-4 py-5 hidden lg:table-cell"><div className="h-3 w-20 rounded bg-white/5" /></td>
                      <td className="px-4 py-5 hidden lg:table-cell"><div className="h-3 w-12 rounded bg-white/5" /></td>
                      <td className="px-4 py-5 hidden sm:table-cell"><div className="h-6 w-20 rounded-lg bg-white/5" /></td>
                      <td className="px-6 py-5"><div className="h-8 w-24 rounded-lg bg-white/5 ml-auto" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                          <Package className="w-7 h-7 text-slate-700" />
                        </div>
                        <p className="text-slate-700 text-xs font-black uppercase tracking-widest">Aucun véhicule trouvé</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(v => (
                    <tr key={v.id} className="group hover:bg-white/[0.015] transition-colors">
                      {/* Image */}
                      <td className="px-6 py-4">
                        <div className="w-14 h-10 rounded-lg overflow-hidden border border-white/5 bg-white/5 relative">
                          {v.image_url ? (
                            <Image src={v.image_url} alt={v.name} fill sizes="56px" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-slate-700" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-4">
                        <p className="font-black text-white text-sm uppercase tracking-tight">{v.name}</p>
                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">{v.brand} · {v.price}</p>
                      </td>

                      {/* Model */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-xs text-slate-400 font-bold">{v.model || "—"}</p>
                      </td>

                      {/* Year */}
                      <td className="px-4 py-4">
                        <span className="text-xs font-black text-white">{v.year || "—"}</span>
                      </td>

                      {/* Mileage */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-xs text-slate-400 font-bold">{v.mileage || "—"}</span>
                      </td>

                      {/* Horsepower */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-xs text-slate-400 font-bold">{v.horsepower ? `${v.horsepower} cv` : "—"}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          v.status === "Disponible" ? "bg-white/5 text-white border-white/10" :
                          v.status === "Vendu" ? "bg-red-400/10 text-red-400 border-red-400/10" :
                          "bg-amber-400/10 text-amber-400 border-amber-400/10"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            v.status === "Disponible" ? "bg-white" :
                            v.status === "Vendu" ? "bg-red-400" : "bg-amber-400"
                          }`} />
                          {v.status || "N/A"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-200">
                          <Link href={`/admin/dashboard/edit/${v.id}`}
                            className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 hover:text-white transition-all" title="Modifier">
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => setDeleteTarget(v)}
                            className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-red-500/30 hover:text-red-400 transition-all" title="Supprimer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest">
              {filtered.length} / {vehicles.length} véhicule{vehicles.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              {sortKey !== "name" || sortDir !== "asc" ? (
                <button onClick={() => { setSortKey("name"); setSortDir("asc"); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all hover:bg-white/5">
                  <X className="w-3 h-3" /> Tri
                </button>
              ) : null}
              <span className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">
                Trié par {sortKey} · {sortDir === "asc" ? "↑" : "↓"}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white text-black text-xs font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4" /> {toast}
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
    </div>
  );
}
