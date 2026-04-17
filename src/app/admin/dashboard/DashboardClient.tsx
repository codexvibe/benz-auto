'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { 
  Plus, Trash2, Edit, Upload, X, Check, AlertCircle, 
  ExternalLink, Image as ImageIcon, ShoppingCart, 
  TrendingUp, Users, Package, Clock, CheckCircle2, 
  Truck, XCircle, DollarSign, Eye, Search, BarChart3
} from 'lucide-react'
import { 
  createProductAction, deleteProductAction, updateProductAction, 
  uploadImageAction, getOrdersAction, updateOrderStatusAction,
  getDashboardStatsAction, getAdminsAction, addAdminAction, deleteAdminAction
} from '../actions'
import { motion, AnimatePresence } from 'framer-motion'

interface Product {
  id: number
  name: string
  category: string
  price: string
  old_price: string | null
  image_url: string
  badge: string | null
  badge_color: string | null
  glow_color: string | null
  views_count?: number
}

interface Order {
  id: number
  customer_name: string
  customer_phone: string
  customer_wilaya: string
  customer_address: string
  items_list: string
  total_price: string
  status: string
  created_at: string
}

interface AdminProfile {
  id: string
  name: string
  passcode: string
}

export default function DashboardClient({ initialProducts }: { initialProducts: any[] }) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'stats' | 'team'>('inventory')
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [orders, setOrders] = useState<Order[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [stats, setStats] = useState<any>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isPending, startTransition] = useTransition()
  
  // Image Upload State
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    category: 'Snus',
    price: '',
    old_price: '',
    badge: '',
    badge_color: 'bg-[#ef4444]',
    glow_color: 'box-glow-green-hover',
    image_url: ''
  })

  const [adminFormData, setAdminFormData] = useState({
    name: '',
    passcode: ''
  })

  // Fetch Data on Tab Change
  useEffect(() => {
    if (activeTab === 'orders') fetchOrders()
    if (activeTab === 'stats') fetchStats()
    if (activeTab === 'team') fetchAdmins()
  }, [activeTab])

  const fetchOrders = async () => {
    const result = await getOrdersAction()
    if (result.data) setOrders(result.data as Order[])
  }

  const fetchStats = async () => {
    const result = await getDashboardStatsAction()
    setStats(result)
  }

  const fetchAdmins = async () => {
    const result = await getAdminsAction()
    if (result.data) setAdmins(result.data as AdminProfile[])
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Snus',
      price: '',
      old_price: '',
      badge: '',
      badge_color: 'bg-[#ef4444]',
      glow_color: 'box-glow-green-hover',
      image_url: ''
    })
    setUploadedUrl('')
    setEditingProduct(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      old_price: product.old_price || '',
      badge: product.badge || '',
      badge_color: product.badge_color || 'bg-[#ef4444]',
      glow_color: product.glow_color || 'box-glow-green-hover',
      image_url: product.image_url
    })
    setUploadedUrl(product.image_url)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return
    startTransition(async () => {
      const result = await deleteProductAction(id)
      if (result.success) setProducts(products.filter(p => p.id !== id))
    })
  }

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    const result = await updateOrderStatusAction(id, status)
    if (result.success) fetchOrders()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    const result = await uploadImageAction(formDataUpload)
    setUploading(false)
    if (result.publicUrl) {
      setUploadedUrl(result.publicUrl)
      setFormData(prev => ({ ...prev, image_url: result.publicUrl }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const submissionData = new FormData()
    Object.entries(formData).forEach(([key, value]) => submissionData.append(key, value))
    startTransition(async () => {
      const result = editingProduct 
        ? await updateProductAction(editingProduct.id, submissionData)
        : await createProductAction(submissionData)
      if (result.success) {
        setIsModalOpen(false)
        resetForm()
        window.location.reload()
      }
    })
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    data.append('name', adminFormData.name)
    data.append('passcode', adminFormData.passcode)
    const result = await addAdminAction(data)
    if (result.success) {
      setIsAdminModalOpen(false)
      setAdminFormData({ name: '', passcode: '' })
      fetchAdmins()
    }
  }

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Supprimer cet admin ?')) return
    const result = await deleteAdminAction(id)
    if (result.success) fetchAdmins()
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Tabs Navigation */}
      <div className="flex flex-col sm:flex-row bg-[#0f0f0f] border border-white/5 p-1 rounded-sm gap-1">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white text-black' : 'text-[#a1a1aa] hover:bg-white/5'}`}
        >
          <Package size={16} /> Produits
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-black' : 'text-[#a1a1aa] hover:bg-white/5'}`}
        >
          <ShoppingCart size={16} /> Commandes
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-white text-black' : 'text-[#a1a1aa] hover:bg-white/5'}`}
        >
          <BarChart3 size={16} /> Statistiques
        </button>
        <button 
          onClick={() => setActiveTab('team')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'team' ? 'bg-white text-black' : 'text-[#a1a1aa] hover:bg-white/5'}`}
        >
          <Users size={16} /> Équipe
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0f0f0f] border border-white/5 p-4 sm:p-6">
              <div>
                <h2 className="text-lg sm:text-xl font-heading uppercase tracking-widest text-[#a1a1aa]">Inventaire</h2>
                <p className="text-[10px] sm:text-xs text-[#525252] mt-1">{products.length} articles disponibles</p>
              </div>
              <button 
                onClick={() => { resetForm(); setIsModalOpen(true); }}
                className="w-full sm:w-auto justify-center bg-white text-black px-4 sm:px-6 py-3 font-heading uppercase flex items-center gap-2 hover:bg-[#39ff14] transition-colors"
              >
                <Plus size={20} /> Nouveau Produit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-[#0f0f0f] border border-white/5 p-4 flex flex-col group relative overflow-hidden transition-all hover:border-[#39ff14]/30">
                  <div className="aspect-square bg-black mb-4 flex items-center justify-center relative overflow-hidden border border-white/5">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-4" />
                    ) : (
                      <ImageIcon className="text-[#262626]" size={48} />
                    )}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 backdrop-blur-md rounded-full">
                       <Eye size={10} className="text-[#39ff14]" />
                       <span className="text-[10px] font-bold text-white">{product.views_count || 0}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-[#39ff14] font-bold uppercase tracking-widest">{product.category}</span>
                    <h3 className="font-heading text-lg mt-1 mb-2 line-clamp-1">{product.name}</h3>
                    <span className="text-[#39ff14] font-bold font-sans">{product.price}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                    <button onClick={() => handleEdit(product)} className="flex-1 bg-white/5 hover:bg-white/10 text-white p-2 flex items-center justify-center transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="flex-1 bg-red-900/10 hover:bg-red-900/30 text-red-500 p-2 flex items-center justify-center transition-colors border border-red-500/10">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="bg-[#0f0f0f] border border-white/5 p-6">
              <h2 className="text-xl font-heading uppercase tracking-widest text-[#a1a1aa]">Commandes Récentes</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-[#525252]">
                    <th className="py-4 px-4 font-bold">Client</th>
                    <th className="py-4 px-4 font-bold">Panier</th>
                    <th className="py-4 px-4 font-bold">Wilaya</th>
                    <th className="py-4 px-4 font-bold">Statut</th>
                    <th className="py-4 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{order.customer_name}</div>
                        <div className="text-xs text-[#525252]">{order.customer_phone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white text-sm max-w-[200px] truncate" title={order.items_list}>{order.items_list}</div>
                        <div className="text-[#39ff14] text-xs font-bold">{order.total_price} DZD</div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell text-xs text-[#a1a1aa]">{order.customer_wilaya}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                          order.status === 'Nouveau' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          order.status === 'Confirmée' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                          order.status === 'Livrée' ? 'bg-[#39ff14]/10 border-[#39ff14]/20 text-[#39ff14]' :
                          'bg-red-500/10 border-red-500/20 text-red-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-start sm:justify-end gap-1 sm:gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity mt-2 sm:mt-0">
                          <button onClick={() => handleUpdateOrderStatus(order.id, 'Confirmée')} title="Confirmer" className="p-1 sm:p-2 bg-[#39ff14]/10 sm:bg-transparent hover:bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/20 sm:border-white/5"><CheckCircle2 size={16} /></button>
                          <button onClick={() => handleUpdateOrderStatus(order.id, 'Livrée')} title="Livrée" className="p-1 sm:p-2 bg-white/5 sm:bg-transparent hover:bg-white/10 text-white border border-white/10 sm:border-white/5"><Truck size={16} /></button>
                          <button onClick={() => handleUpdateOrderStatus(order.id, 'Annulée')} title="Annuler" className="p-1 sm:p-2 bg-red-500/10 sm:bg-transparent hover:bg-red-500/20 text-red-500 border border-red-500/20 sm:border-white/5"><XCircle size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={5} className="py-20 text-center text-[#525252] uppercase font-heading text-xl">Aucune commande</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0f0f0f] border border-white/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={80} /></div>
                <h3 className="text-xs font-bold text-[#525252] uppercase tracking-[0.3em] mb-2">Chiffre d'Affaires</h3>
                <div className="text-4xl font-heading text-[#39ff14]">{stats?.totalRevenue?.toLocaleString() || 0} DZD</div>
              </div>
              <div className="bg-[#0f0f0f] border border-white/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Package size={80} /></div>
                <h3 className="text-xs font-bold text-[#525252] uppercase tracking-[0.3em] mb-2">Total Commandes</h3>
                <div className="text-4xl font-heading text-white">{stats?.totalOrders || 0}</div>
              </div>
              <div className="bg-[#0f0f0f] border border-white/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={80} /></div>
                <h3 className="text-xs font-bold text-[#525252] uppercase tracking-[0.3em] mb-2">Total Produits</h3>
                <div className="text-4xl font-heading text-white">{stats?.productsCount || 0}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0f0f0f] border border-white/5 p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Eye size={18} className="text-[#39ff14]" /> Les plus regardés
                </h3>
                <div className="space-y-4">
                  {stats?.mostViewed?.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#262626]">0{i+1}</span>
                        <div className="text-sm font-bold text-[#a1a1aa] group-hover:text-white transition-colors">{p.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(p.views_count / (stats.mostViewed[0].views_count || 1)) * 100}%` }}
                            className="h-full bg-[#39ff14]"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#39ff14]">{p.views_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0f0f0f] border border-white/5 p-4 sm:p-6 gap-4">
              <h2 className="text-lg sm:text-xl font-heading uppercase tracking-widest text-[#a1a1aa]">Administration</h2>
              <button 
                onClick={() => setIsAdminModalOpen(true)}
                className="w-full sm:w-auto justify-center bg-white text-black px-4 sm:px-6 py-2 sm:py-3 font-heading uppercase flex items-center gap-2 hover:bg-[#39ff14] transition-colors"
                >
                <Plus size={20} /> Nouvel Admin
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map((admin) => (
                <div key={admin.id} className="bg-[#0f0f0f] border border-white/10 p-6 flex flex-col gap-4 relative group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <Users size={24} className="text-[#39ff14]" />
                    </div>
                    <div>
                      <div className="font-heading text-lg text-white uppercase">{admin.name}</div>
                      <div className="text-[10px] font-bold text-[#525252] tracking-widest uppercase">Passcode: ••••</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl bg-[#0f0f0f] border border-white/10 p-5 sm:p-8 relative overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-heading uppercase tracking-tighter">
                  {editingProduct ? 'MODIFIER LE PRODUIT' : 'AJOUTER UN PRODUIT'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-[#a1a1aa] hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest mb-1">Nom du Produit</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:border-[#39ff14] outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest mb-1">Catégorie</label>
                        <select value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:border-[#39ff14] outline-none">
                          <option value="Snus">Snus</option>
                          <option value="Vape Jetable">Vape Jetable</option>
                          <option value="Puff">Puff</option>
                          <option value="E-Liquides">E-Liquides</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest mb-1">Prix (DZD)</label>
                          <input type="text" required value={formData.price} placeholder="1 600 DZD" onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:border-[#39ff14] outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest mb-1">Ancien Prix</label>
                          <input type="text" value={formData.old_price} placeholder="1 900 DZD" onChange={e => setFormData(prev => ({ ...prev, old_price: e.target.value }))} className="w-full bg-black border border-white/10 px-4 py-2 text-sm focus:border-[#39ff14] outline-none" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest mb-1">Image</label>
                      <div className="space-y-3">
                        {(uploadedUrl || formData.image_url) && (
                          <div className="relative aspect-square w-32 mx-auto bg-black border border-white/10 p-2">
                             <img src={uploadedUrl || formData.image_url} className="w-full h-full object-contain" alt="Preview" />
                             <button type="button" onClick={() => { setUploadedUrl(''); setFormData(prev => ({ ...prev, image_url: '' })) }} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"><X size={12} /></button>
                          </div>
                        )}
                        <div className="relative h-32 w-full border-2 border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center hover:border-[#39ff14]/50 transition-colors group">
                          {uploading ? (
                            <div className="w-6 h-6 border-2 border-[#39ff14] border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Upload className="text-[#525252] group-hover:text-[#39ff14] mb-2" size={24} />
                              <span className="text-[10px] text-[#525252] font-bold uppercase">Upload</span>
                              <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                 </div>
                 <button type="submit" disabled={isPending || uploading} className="w-full bg-[#39ff14] text-black font-heading py-4 mt-4 uppercase hover:bg-white transition-colors disabled:opacity-50">
                  {isPending ? 'Enregistrement...' : editingProduct ? 'Mettre à jour' : 'Créer'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN MODAL */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdminModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-[#0f0f0f] border border-white/10 p-5 sm:p-8 relative">
              <h2 className="text-xl sm:text-2xl font-heading uppercase tracking-tighter mb-6 sm:mb-8 text-white">Nouvel Administrateur</h2>
              <form onSubmit={handleAddAdmin} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest mb-1">Nom</label>
                  <input type="text" required value={adminFormData.name} onChange={e => setAdminFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:border-[#39ff14] outline-none text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest mb-1">Passcode</label>
                  <input type="password" required value={adminFormData.passcode} onChange={e => setAdminFormData(prev => ({ ...prev, passcode: e.target.value }))} className="w-full bg-black border border-white/10 px-4 py-3 text-sm focus:border-[#39ff14] outline-none text-white tracking-widest" />
                </div>
                <button type="submit" className="w-full bg-white text-black font-heading py-4 uppercase hover:bg-[#39ff14] transition-colors">
                  Ajouter à l'équipe
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
