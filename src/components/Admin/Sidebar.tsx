"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Package, MessageSquare, Tag, Settings, LogOut, Car, ArrowRight
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble", exact: true },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventaire", aliases: ["/admin/dashboard/new", "/admin/dashboard/edit"] },
  { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes" },
  { href: "/admin/dashboard/promos", icon: Tag, label: "Promotions" },
  { href: "/admin/dashboard/settings", icon: Settings, label: "Paramètres" },
];

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-full xl:w-72 bg-surface border border-white/5 rounded-3xl p-6 flex flex-col shrink-0 shadow-2xl">
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
        {navItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname?.startsWith(item.href) || item.aliases?.some(alias => pathname?.startsWith(alias));

          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest relative ${isActive ? "bg-white/5 text-white" : "text-slate-600 hover:text-white hover:bg-white/3"}`}>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />}
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {isActive && <ArrowRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>
      <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest mt-4 border border-white/5">
        <LogOut className="w-4 h-4" /> Déconnexion
      </button>
    </aside>
  );
}
