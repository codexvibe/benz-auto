'use client'

import { useState } from 'react'
import { loginAction } from './actions'
import { motion } from 'framer-motion'
import { useActionState } from 'react'
import { ShieldAlert, ShieldCheck, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ef4444] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#39ff14] rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#0f0f0f] border border-black/10 dark:border-white/10 p-8 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-4">
            <ShieldCheck className="text-[#39ff14]" size={32} />
          </div>
          <h1 className="text-3xl font-heading text-black dark:text-white uppercase tracking-tighter">
            ADMIN <span className="text-[#39ff14]">ZONE</span>
          </h1>
          <p className="text-[#a1a1aa] mt-2 font-sans">Accès réservé au personnel HM.ZONEDZ</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="passcode" className="block text-xs font-bold text-[#a1a1aa] uppercase tracking-widest mb-2">
              Passcode de Sécurité
            </label>
            <input
              type="password"
              name="passcode"
              id="passcode"
              required
              placeholder="••••••••"
              className="w-full bg-gray-50 dark:bg-black border border-black/10 dark:border-white/10 text-black dark:text-white px-4 py-3 focus:outline-none focus:border-[#39ff14] dark:focus:border-[#39ff14] transition-colors font-sans text-lg tracking-[0.5em]"
            />
          </div>

          {state?.error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[#ef4444] text-sm bg-[#ef4444]/10 p-3 border border-[#ef4444]/20"
            >
              <ShieldAlert size={16} />
              <span>{state.error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black dark:bg-white text-white dark:text-black font-heading text-lg py-4 flex items-center justify-center gap-2 uppercase hover:bg-[#39ff14] dark:hover:bg-[#39ff14] hover:text-black dark:hover:text-black transition-all group disabled:opacity-50"
          >
            {isPending ? 'Vérification...' : (
              <>
                ENTRER DANS LE DASHBOARD
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 text-center">
          <p className="text-xs text-[#525252] uppercase tracking-[0.2em]">HM.ZONEDZ Control System v1.0</p>
        </div>
      </motion.div>
    </main>
  )
}
