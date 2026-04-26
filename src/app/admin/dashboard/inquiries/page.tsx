"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  Trash2, 
  LogOut, 
  LayoutDashboard,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Video
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) {
      router.push("/admin");
      return;
    }
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    // In a real app, you'd create an 'inquiries' table
    const { data } = await supabase
      .from("orders") // Re-using orders table for now as inquiries
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setInquiries(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#ff0000] flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">ADMIN <span className="text-[#ff0000]">BA</span></span>
        </div>

        <nav className="space-y-2 flex-grow">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Stock
          </Link>
          <Link href="/admin/dashboard/videos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Video className="w-5 h-5" />
            Vlogs & Tests
          </Link>
          <Link href="/admin/dashboard/inquiries" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ff0000]/10 text-[#ff0000] font-medium">
            <MessageSquare className="w-5 h-5" />
            Demandes (Leads)
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
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
      <main className="flex-grow p-4 md:p-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Gestion des Demandes</h1>
          <p className="text-gray-500">Répondez aux clients intéressés par vos véhicules.</p>
        </header>

        <div className="glass-dark rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-xs text-gray-500 uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Véhicule / Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-10 text-center">Chargement...</td></tr>
                ) : inquiries.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500">Aucune demande pour le moment</td></tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold">{inq.customer_name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Phone className="w-3 h-3" /> {inq.customer_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{inq.items_list || "Demande d'informations"}</div>
                        <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(inq.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          inq.status === 'Traitée' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(inq.id, 'Traitée')}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(inq.id, 'Annulée')}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                          >
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
      </main>
    </div>
  );
}
