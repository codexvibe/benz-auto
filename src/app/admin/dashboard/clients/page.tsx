"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car, LayoutDashboard, Video, MessageSquare, Settings, Eye, LogOut,
  Users, Tag, Phone, Search, User, Clock, CheckCircle2, XCircle
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

export default function CRMClientsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    const allOrders = data || [];
    setOrders(allOrders);

    // Group by phone number to create unique client profiles
    const clientMap: Record<string, any> = {};
    allOrders.forEach((order: any) => {
      const key = order.customer_phone;
      if (!clientMap[key]) {
        clientMap[key] = {
          name: order.customer_name,
          phone: order.customer_phone,
          orders: [],
          firstContact: order.created_at,
          lastContact: order.created_at,
        };
      }
      clientMap[key].orders.push(order);
      if (new Date(order.created_at) > new Date(clientMap[key].lastContact)) {
        clientMap[key].lastContact = order.created_at;
      }
    });
    setClients(Object.values(clientMap));
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    fetchOrders();
    if (selectedClient) {
      setSelectedClient((prev: any) => ({
        ...prev,
        orders: prev.orders.map((o: any) => o.id === orderId ? { ...o, status } : o),
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de Bord" },
    { href: "/admin/dashboard/clients", icon: Users, label: "CRM Clients", active: true },
    { href: "/admin/dashboard/videos", icon: Video, label: "Vlogs & Tests" },
    { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes (Leads)" },
    { href: "/admin/dashboard/promos", icon: Tag, label: "Codes Promos" },
    { href: "/admin/dashboard/settings", icon: Settings, label: "Paramètres" },
    { href: "/", icon: Eye, label: "Voir le site" },
  ];

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-1">CRM Clients</h1>
          <p className="text-gray-500">Gérez vos clients et l'historique de leurs demandes.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-dark p-5 rounded-2xl border border-white/5">
            <div className="text-3xl font-bold">{clients.length}</div>
            <div className="text-gray-500 text-sm mt-1">Clients Uniques</div>
          </div>
          <div className="glass-dark p-5 rounded-2xl border border-white/5">
            <div className="text-3xl font-bold">{orders.filter(o => o.status === "En attente").length}</div>
            <div className="text-gray-500 text-sm mt-1">Demandes En Attente</div>
          </div>
          <div className="glass-dark p-5 rounded-2xl border border-white/5">
            <div className="text-3xl font-bold">{orders.filter(o => o.status === "Traité").length}</div>
            <div className="text-gray-500 text-sm mt-1">Demandes Traitées</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Client List */}
          <div className="lg:w-2/5">
            <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un client..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#ff0000] transition-all"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="py-10 text-center text-gray-500 text-sm">Chargement...</div>
                ) : filtered.length === 0 ? (
                  <div className="py-10 text-center text-gray-500 text-sm">Aucun client trouvé</div>
                ) : (
                  filtered.map((client, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedClient(client)}
                      className={`w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors ${selectedClient?.phone === client.phone ? "bg-[#ff0000]/5 border-l-2 border-[#ff0000]" : ""}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#ff0000]/10 flex items-center justify-center text-[#ff0000] font-bold shrink-0">
                        {client.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-semibold text-sm truncate">{client.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />{client.phone}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-xs font-bold text-[#ff0000]">{client.orders.length}</div>
                        <div className="text-[10px] text-gray-500">demande{client.orders.length > 1 ? "s" : ""}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Client Detail Panel */}
          <div className="flex-grow">
            {!selectedClient ? (
              <div className="glass-dark rounded-2xl border border-white/5 h-full min-h-[300px] flex flex-col items-center justify-center text-gray-500">
                <User className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Sélectionnez un client pour voir son profil</p>
              </div>
            ) : (
              <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
                {/* Profile Header */}
                <div className="p-6 border-b border-white/5 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-[#ff0000]/10 flex items-center justify-center text-[#ff0000] font-bold text-2xl">
                    {selectedClient.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedClient.name}</h2>
                    <div className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                      <Phone className="w-4 h-4" /> {selectedClient.phone}
                    </div>
                    <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> Premier contact : {formatDate(selectedClient.firstContact)}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-[#ff0000]/10 text-[#ff0000] font-bold text-sm px-3 py-1 rounded-full">
                      {selectedClient.orders.length} demande{selectedClient.orders.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Orders History */}
                <div className="p-6">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">Historique des Demandes</h3>
                  <div className="space-y-3">
                    {selectedClient.orders.map((order: any) => (
                      <div key={order.id} className="bg-black/30 rounded-xl p-4 border border-white/5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-semibold text-sm">{order.items_list || "Demande générale"}</div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {formatDate(order.created_at)}
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => updateOrderStatus(order.id, "Traité")}
                              className={`p-1.5 rounded-lg transition-all ${order.status === "Traité" ? "bg-green-500/20 text-green-400" : "text-gray-600 hover:bg-green-500/10 hover:text-green-400"}`}
                              title="Marquer comme traité"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, "Annulé")}
                              className={`p-1.5 rounded-lg transition-all ${order.status === "Annulé" ? "bg-red-500/20 text-red-400" : "text-gray-600 hover:bg-red-500/10 hover:text-red-400"}`}
                              title="Annuler"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            order.status === "En attente" ? "bg-yellow-500/10 text-yellow-400" :
                            order.status === "Traité" ? "bg-green-500/10 text-green-400" :
                            "bg-red-500/10 text-red-400"
                          }`}>{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
