"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, Edit2, Trash2, LogOut, Car,
  Package, LayoutDashboard, Eye, Video, MessageSquare,
  Settings, Users, Tag
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

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
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setVehicles(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) return;
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

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de Bord" },
    { href: "/admin/dashboard/stock", icon: Package, label: "Stock", active: true },
    { href: "/admin/dashboard/clients", icon: Users, label: "CRM Clients" },
    { href: "/admin/dashboard/videos", icon: Video, label: "Vlogs & Tests" },
    { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes (Leads)" },
    { href: "/admin/dashboard/promos", icon: Tag, label: "Codes Promos" },
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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Gestion du Stock</h1>
            <p className="text-gray-500">Ajoutez, modifiez et supprimez les véhicules de votre catalogue.</p>
          </div>
          <Link
            href="/admin/dashboard/new"
            className="px-6 py-3 bg-[#ff0000] text-white font-bold rounded-xl hover:bg-[#cc0000] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter un véhicule
          </Link>
        </header>

        {/* Table */}
        <div className="glass-dark rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-bold text-lg">Liste des Véhicules ({filtered.length})</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Filtrer par nom ou marque..."
                className="bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#ff0000] transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-widest bg-white/5">
                  <th className="px-6 py-4 font-bold">Véhicule</th>
                  <th className="px-6 py-4 font-bold">Catégorie</th>
                  <th className="px-6 py-4 font-bold">Prix</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Photos</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">Chargement...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">Aucun véhicule trouvé</td></tr>
                ) : (
                  filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-900 overflow-hidden border border-white/5 shrink-0">
                            {v.image_url && <img src={v.image_url} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-[#ff0000] transition-colors">{v.name}</div>
                            <div className="text-xs text-gray-500">{v.brand} · {v.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-300">{v.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{v.price}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${
                          v.status === "Disponible" ? "text-green-400" :
                          v.status === "Vendu" ? "text-red-400" :
                          v.status === "Réservé" ? "text-yellow-400" :
                          "text-blue-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            v.status === "Disponible" ? "bg-green-400" :
                            v.status === "Vendu" ? "bg-red-400" :
                            v.status === "Réservé" ? "bg-yellow-400" :
                            "bg-blue-400"
                          }`} />
                          {v.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400">
                          {(Array.isArray(v.images) ? v.images.length : 0) + (v.image_url ? 1 : 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/dashboard/edit/${v.id}`}
                            className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-all"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(v.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                            title="Supprimer"
                          >
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
      </main>
    </div>
  );
}
