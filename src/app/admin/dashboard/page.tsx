import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { logoutAction, createProductAction, deleteProductAction, uploadImageAction } from '../actions'
import DashboardClient from './DashboardClient'
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await verifySession()

  if (!session.isAuth) {
    redirect('/admin')
  }

  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white font-sans transition-colors duration-300">
      <header className="border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#0f0f0f] px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-heading uppercase tracking-tighter">
            ADMIN <span className="text-[#39ff14]">DASHBOARD</span>
          </h1>
          <span className="px-2 py-0.5 rounded bg-[#39ff14]/10 text-[#39ff14] text-[10px] font-bold uppercase tracking-widest border border-[#39ff14]/20">
            Live
          </span>
        </div>
        
        <form action={logoutAction}>
          <button className="text-xs font-bold text-gray-500 hover:text-black dark:text-[#a1a1aa] dark:hover:text-white uppercase tracking-widest transition-colors border border-black/10 hover:bg-black/5 dark:border-white/10 px-4 py-2 dark:hover:bg-white/5">
            Déconnexion
          </button>
        </form>
      </header>

      <main className="container mx-auto p-6">
        <DashboardClient initialProducts={products || []} />
      </main>

      <footer className="border-t border-black/10 dark:border-white/5 py-8 mt-12 transition-colors duration-300">
        <div className="container mx-auto px-6 flex justify-between items-center opacity-30 grayscale cursor-default select-none transition-all hover:opacity-100 hover:grayscale-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]">HM.ZONEDZ SYSTEM v1.0.4</p>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
