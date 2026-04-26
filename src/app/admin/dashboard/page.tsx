"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  LogOut, 
  Car, 
  TrendingUp, 
  Package, 
  Clock,
  LayoutDashboard,
  Eye,
  Video,
  MessageSquare,
  Settings
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../utils/supabase/client";

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check session
    const session = localStorage.getItem("admin_session");
    if (!session) {
      router.push("/admin");
      return;
    }

    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setVehicles(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (!error) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#ff0000] flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">ADMIN <span className="text-[#ff0000]">BA</span></span>
        </div>

        <nav className="space-y-2 flex-grow">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ff0000]/10 text-[#ff0000] font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Stock
          </Link>
          <Link href="/admin/dashboard/videos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Video className="w-5 h-5" />
            Vlogs & Tests
          </Link>
          <Link href="/admin/dashboard/inquiries" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <MessageSquare className="w-5 h-5" />
            Demandes (Leads)
          </Link>
          <Link href="/admin/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>
          <Link href="/cars" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Eye className="w-5 h-5" />
            Voir le site
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion du Stock</h1>
            <p className="text-gray-500">Ajoutez et modifiez les véhicules de votre catalogue.</p>
          </div>
          <Link 
            href="/admin/dashboard/new" 
            className="px-6 py-3 bg-[#ff0000] text-white font-bold rounded-xl hover:bg-[#cc0000] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter un véhicule
          </Link>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-dark p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">Total</span>
            </div>
            <div className="text-3xl font-bold">{vehicles.length}</div>
            <div className="text-gray-500 text-sm mt-1">Véhicules en stock</div>
          </div>
          <div className="glass-dark p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">Succès</span>
            </div>
            <div className="text-3xl font-bold">12</div>
            <div className="text-gray-500 text-sm mt-1">Véhicules vendus</div>
          </div>
          <div className="glass-dark p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-1 rounded-md">Actif</span>
            </div>
            <div className="text-3xl font-bold">5</div>
            <div className="text-gray-500 text-sm mt-1">Demandes en attente</div>
          </div>
        </div>

        {/* Table/List Section */}
        <div className="glass-dark rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-bold text-lg">Liste des Véhicules</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Filtrer..." 
                className="bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#ff0000] transition-all"
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
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">Chargement...</td></tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">Aucun véhicule trouvé</td></tr>
                ) : (
                  filteredVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-900 overflow-hidden border border-white/5">
                            {v.image_url && <img src={v.image_url} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-[#ff0000] transition-colors">{v.name}</div>
                            <div className="text-xs text-gray-500">{v.description?.substring(0, 30)}...</div>
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
                        <span className="flex items-center gap-1.5 text-xs text-green-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                          En ligne
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/dashboard/edit/${v.id}`}
                            className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(v.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
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
