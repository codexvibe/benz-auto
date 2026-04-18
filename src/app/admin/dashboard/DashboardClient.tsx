'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { 
  Plus, Trash2, Edit, Upload, X, Check, AlertCircle, 
  ExternalLink, Image as ImageIcon, ShoppingCart, 
  TrendingUp, Users, Package, Clock, CheckCircle2, 
  Truck, XCircle, DollarSign, Eye, Search, BarChart3, Play
} from 'lucide-react'
import { 
  createProductAction, deleteProductAction, updateProductAction, 
  uploadImageAction, getOrdersAction, updateOrderStatusAction, deleteOrderAction,
  getDashboardStatsAction, getAdminsAction, addAdminAction, deleteAdminAction
} from '../actions'
import { motion, AnimatePresence } from 'framer-motion'

interface Product {
  id: number
  name: string
  description?: string
  category: string
  price: string
  old_price: string | null
  sku?: string
  stock_quantity?: number
  is_visible?: boolean
  is_18_plus?: boolean
  images: string[]
  video_url: string | null
  image_url: string // For compatibility
  badge: string | null
  badge_color: string | null
  glow_color: string | null
  views_count?: number
  flavors?: { name: string, detail: string }[]
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

  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false)
  const [isAddingNewBadgeText, setIsAddingNewBadgeText] = useState(false)
  const [isAddingNewBadgeColor, setIsAddingNewBadgeColor] = useState(false)
  const [isAddingNewGlow, setIsAddingNewGlow] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vape',
    price: '',
    old_price: '',
    stock_quantity: 0,
    is_visible: true,
    is_18_plus: false,
    badge: '',
    badge_color: 'bg-[#ef4444]',
    glow_color: 'box-glow-green-hover',
    images: [] as string[],
    video_url: '',
    image_url: '',
    flavors: [] as { name: string, detail: string }[]
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

  const DEFAULT_CATEGORIES = ['Vape', 'Snus', 'Puff', 'E-Liquides', 'Accessoires', 'Promos', 'Gros', 'Puff 9k', 'Puff 12k', 'Puff 15k'];

  const fetchAdmins = async () => {
    const result = await getAdminsAction()
    if (result.data) setAdmins(result.data as AdminProfile[])
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Vape',
      price: '',
      old_price: '',
      stock_quantity: 0,
      is_visible: true,
      is_18_plus: false,
      badge: '',
      badge_color: 'bg-[#ef4444]',
      glow_color: 'box-glow-green-hover',
      images: [],
      video_url: '',
      image_url: '',
      flavors: []
    })
    setUploadedUrl('')
    setEditingProduct(null)
    setIsAddingNewCategory(false)
    setIsAddingNewBadgeText(false)
    setIsAddingNewBadgeColor(false)
    setIsAddingNewGlow(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category || 'Vape',
      price: product.price,
      old_price: product.old_price || '',
      stock_quantity: product.stock_quantity || 0,
      is_visible: product.is_visible ?? true,
      is_18_plus: product.is_18_plus ?? false,
      badge: product.badge || '',
      badge_color: product.badge_color || 'bg-[#ef4444]',
      glow_color: product.glow_color || 'box-glow-green-hover',
      images: product.images || (product.image_url ? [product.image_url] : []),
      video_url: product.video_url || '',
      image_url: product.image_url || '',
      flavors: product.flavors || []
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return
    startTransition(async () => {
      const result = await deleteProductAction(id)
      if (result.success) {
        setProducts(products.filter(p => p.id !== id))
      } else {
        alert("Erreur lors de la suppression : " + (result.error || "Inconnue"))
      }
    })
  }

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    const result = await updateOrderStatusAction(id, status)
    if (result.success) {
      fetchOrders()
    } else {
      alert("Erreur lors de la mise à jour : " + (result.error || "Inconnue"))
    }
  }

  const handleDeleteOrder = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette commande ?')) return
    startTransition(async () => {
      const result = await deleteOrderAction(id)
      if (result.success) {
        setOrders(orders.filter(o => o.id !== id))
      } else {
        alert("Erreur lors de la suppression de la commande : " + (result.error || "Inconnue"))
      }
    })
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isVideo = false) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    const result = await uploadImageAction(formDataUpload)
    setUploading(false)
    if (result.publicUrl) {
      if (isVideo) {
        setFormData(prev => ({ ...prev, video_url: result.publicUrl }))
      } else {
        setFormData(prev => {
          const newImages = [...prev.images, result.publicUrl].slice(0, 5)
          return { 
            ...prev, 
            images: newImages,
            image_url: prev.image_url || result.publicUrl 
          }
        })
      }
    } else if (result.error) {
      alert("Erreur Upload : " + result.error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const submissionData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'flavors' || key === 'images') {
        submissionData.append(key, JSON.stringify(value))
      } else {
        submissionData.append(key, String(value || ''))
      }
    })
    
    startTransition(async () => {
      const result = editingProduct 
        ? await updateProductAction(editingProduct.id, submissionData)
        : await createProductAction(submissionData)
      if (result.success) {
        window.location.reload()
      } else {
        alert("Erreur : " + result.error)
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
      <div className="flex flex-col sm:flex-row bg-white dark:bg-[#0f0f0f] border border-black/5 dark:border-white/5 p-1 rounded-sm gap-1 shadow-sm">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-500 dark:text-[#a1a1aa] hover:bg-black/5 dark:hover:bg-white/5'}`}
        >
          <Package size={16} /> Produits
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-500 dark:text-[#a1a1aa] hover:bg-black/5 dark:hover:bg-white/5'}`}
        >
          <ShoppingCart size={16} /> Commandes
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-500 dark:text-[#a1a1aa] hover:bg-black/5 dark:hover:bg-white/5'}`}
        >
          <BarChart3 size={16} /> Statistiques
        </button>
        <button 
          onClick={() => setActiveTab('team')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'team' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-500 dark:text-[#a1a1aa] hover:bg-black/5 dark:hover:bg-white/5'}`}
        >
          <Users size={16} /> Équipe
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div key="inventory" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0f0f0f] border border-black/5 dark:border-white/5 p-4 sm:p-6 shadow-sm dark:shadow-none">
              <div>
                <h2 className="text-lg sm:text-xl font-heading uppercase tracking-widest text-[#a1a1aa]">Inventaire</h2>
                <p className="text-[10px] sm:text-xs text-[#525252] mt-1">{products.length} articles disponibles</p>
              </div>
              <button 
                onClick={() => { resetForm(); setIsModalOpen(true); }}
                className="w-full sm:w-auto justify-center bg-black dark:bg-white text-white dark:text-black px-4 sm:px-6 py-3 font-heading uppercase flex items-center gap-2 hover:text-black dark:hover:text-black hover:bg-[#39ff14] dark:hover:bg-[#39ff14] transition-colors"
              >
                <Plus size={20} /> Nouveau Produit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white dark:bg-[#050505] border border-black/5 dark:border-white/5 p-5 flex flex-col group relative overflow-hidden transition-all hover:border-[#39ff14]/30 shadow-md dark:shadow-2xl">
                  <div className="aspect-[4/5] bg-gradient-to-b from-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:to-[#000000] mb-6 flex items-center justify-center relative overflow-hidden border border-black/5 dark:border-white/5 group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02] transition-colors">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        loading="lazy"
                        className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <ImageIcon className="text-black/10 dark:text-white/10" size={48} />
                    )}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                       {product.is_18_plus && (
                        <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-bold px-2 py-1 uppercase tracking-widest">18+</span>
                       )}
                       {product.badge && (
                        <span className={`${product.badge_color || 'bg-[#ff00ff]'} text-white text-[8px] font-bold px-2 py-1 uppercase tracking-widest shadow-lg`}>
                          {product.badge}
                        </span>
                       )}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-heading text-xl mb-2 text-black dark:text-white uppercase tracking-tighter group-hover:text-[#39ff14] transition-colors">{product.name}</h3>
                    <div className="flex items-baseline gap-3">
                      <div className="text-[#39ff14] text-xl font-bold font-sans">{product.price}</div>
                      {product.old_price && (
                        <div className="text-gray-400 dark:text-white/30 text-sm font-sans line-through">{product.old_price}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex gap-3">
                    <button onClick={() => handleEdit(product)} className="flex-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white p-3 flex items-center justify-center transition-all border border-black/10 dark:border-white/10 hover:border-[#39ff14]/50"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(product.id)} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 p-3 flex items-center justify-center transition-all border border-red-500/20"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div key="orders" className="space-y-6">
            <div className="bg-white dark:bg-[#0f0f0f] border border-black/5 dark:border-white/5 p-6 shadow-sm dark:shadow-none">
              <h2 className="text-xl font-heading uppercase tracking-widest text-[#a1a1aa]">Commandes Récentes</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10 text-[10px] uppercase tracking-[0.2em] text-[#525252]">
                    <th className="py-4 px-4 font-bold">Client</th>
                    <th className="py-4 px-4 font-bold">Panier</th>
                    <th className="py-4 px-4 font-bold">Wilaya</th>
                    <th className="py-4 px-4 font-bold">Statut</th>
                    <th className="py-4 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-4">
                        <div className="font-bold text-black dark:text-white">{order.customer_name}</div>
                        <div className="text-xs text-[#525252]">{order.customer_phone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-black dark:text-white text-sm" title={order.items_list}>{order.items_list}</div>
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
                          <button onClick={() => handleUpdateOrderStatus(order.id, 'Confirmée')} title="Confirmer" className="p-1 sm:p-2 bg-[#39ff14]/10 sm:bg-transparent hover:bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/20 sm:border-black/5 sm:dark:border-white/5"><CheckCircle2 size={16} /></button>
                          <button onClick={() => handleUpdateOrderStatus(order.id, 'Livrée')} title="Livrée" className="p-1 sm:p-2 bg-black/5 dark:bg-white/5 sm:bg-transparent hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 sm:border-black/5 sm:dark:border-white/5"><Truck size={16} /></button>
                          <button onClick={() => handleDeleteOrder(order.id)} title="Supprimer définitivement" className="p-1 sm:p-2 bg-red-900/10 sm:bg-transparent hover:bg-red-500/20 text-red-500 border border-red-500/20 sm:border-black/5 sm:dark:border-white/5"><Trash2 size={16} /></button>
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
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#050505] border border-black/5 dark:border-white/5 p-8 relative overflow-hidden group shadow-md dark:shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={80} className="text-[#39ff14]" /></div>
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-[0.3em] mb-4">Chiffre d'Affaires</h3>
                <div className="text-4xl font-heading text-[#39ff14] tracking-tighter">{stats?.totalRevenue?.toLocaleString() || 0} DZD</div>
              </div>
              <div className="bg-white dark:bg-[#050505] border border-black/5 dark:border-white/5 p-8 relative overflow-hidden group shadow-md dark:shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Package size={80} className="text-black dark:text-white" /></div>
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-[0.3em] mb-4">Total Commandes</h3>
                <div className="text-4xl font-heading text-black dark:text-white tracking-tighter">{stats?.totalOrders || 0}</div>
              </div>
              <div className="bg-white dark:bg-[#050505] border border-black/5 dark:border-white/5 p-8 relative overflow-hidden group shadow-md dark:shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={80} className="text-black dark:text-white" /></div>
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-[0.3em] mb-4">Total Produits</h3>
                <div className="text-4xl font-heading text-black dark:text-white tracking-tighter">{stats?.productsCount || 0}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#050505] border border-black/5 dark:border-white/5 p-8 relative overflow-hidden group shadow-md dark:shadow-2xl">
                <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                  <Eye size={20} className="text-[#39ff14]" /> 
                  Performances produits
                </h3>
                <div className="space-y-6">
                  {stats?.mostViewed?.map((p: any, i: number) => (
                    <div key={i} className="flex flex-col gap-2 group/item">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold text-black/20 dark:text-white/20 group-hover/item:text-[#39ff14] transition-colors">0{i+1}</span>
                          <div className="text-sm font-bold text-gray-500 dark:text-white/60 group-hover/item:text-black dark:group-hover/item:text-white transition-colors uppercase tracking-tight">{p.name}</div>
                        </div>
                        <span className="text-xs font-bold text-[#39ff14] font-sans">{p.views_count} <span className="text-[9px] text-[#39ff14]/40">VUES</span></span>
                      </div>
                      <div className="h-1 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(p.views_count / (stats.mostViewed[0].views_count || 1)) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#39ff14]/20 to-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                        />
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-[#0f0f0f] border border-black/5 dark:border-white/5 p-4 sm:p-6 gap-4 shadow-sm dark:shadow-none">
              <h2 className="text-lg sm:text-xl font-heading uppercase tracking-widest text-[#a1a1aa]">Administration</h2>
              <button 
                onClick={() => setIsAdminModalOpen(true)}
                className="w-full sm:w-auto justify-center bg-black dark:bg-white text-white dark:text-black px-4 sm:px-6 py-2 sm:py-3 font-heading uppercase flex items-center gap-2 hover:bg-[#39ff14] dark:hover:bg-[#39ff14] hover:text-black transition-colors"
                >
                <Plus size={20} /> Nouvel Admin
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map((admin) => (
                <div key={admin.id} className="bg-white dark:bg-[#0f0f0f] border border-black/10 dark:border-white/10 p-6 flex flex-col gap-4 relative group shadow-sm dark:shadow-none">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/10 dark:border-white/10">
                      <Users size={24} className="text-[#39ff14]" />
                    </div>
                    <div>
                      <div className="font-heading text-lg text-black dark:text-white uppercase">{admin.name}</div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-4xl bg-black border border-white/10 p-6 sm:p-10 relative overflow-y-auto max-h-[95vh] shadow-2xl rounded-sm">
              
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-heading uppercase tracking-widest text-[#39ff14]">
                  {editingProduct ? 'MODIFIER LE PRODUIT' : 'AJOUTER UN PRODUIT'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors"><X size={32} /></button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em] mb-2">Nom du Produit</label>
                    <input type="text" required value={formData.name} placeholder="p.ex. TORNADO 9000" onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em] mb-2">Description du Produit</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors resize-none" placeholder="Décrivez le produit en détail..." />
                  </div>

                  {/* Category Field */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em]">Catégorie</label>
                       <button 
                         type="button" 
                         onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                         className="text-[#39ff14] hover:bg-[#39ff14]/10 p-1 rounded transition-colors"
                         title={isAddingNewCategory ? "Choisir existante" : "Ajouter nouvelle"}
                       >
                         {isAddingNewCategory ? <X size={14} /> : <Plus size={14} />}
                       </button>
                    </div>
                    {isAddingNewCategory ? (
                      <input 
                        type="text" 
                        required 
                        value={formData.category} 
                        placeholder="Ex: Accessoires, E-liquide..." 
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} 
                        className="w-full bg-[#111] border border-[#39ff14]/50 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors" 
                      />
                    ) : (
                      <select 
                        value={formData.category} 
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors appearance-none cursor-pointer"
                      >
                         {Array.from(new Set([...DEFAULT_CATEGORIES, ...products.map(p => p.category)])).map(cat => (
                           <option key={cat} value={cat}>{cat}</option>
                         ))}
                         {formData.category && !Array.from(new Set([...DEFAULT_CATEGORIES, ...products.map(p => p.category)])).includes(formData.category) && (
                           <option value={formData.category}>{formData.category}</option>
                         )}
                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em] mb-2">Prix de Vente (DZD)</label>
                      <input type="text" required value={formData.price} placeholder="1 600 DZD" onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em] mb-2">Ancien Prix (DZD)</label>
                      <input 
                        type="text" 
                        value={formData.old_price} 
                        placeholder="2 000 DZD" 
                        onChange={e => {
                          const val = e.target.value;
                          setFormData(prev => ({ 
                            ...prev, 
                            old_price: val,
                            // Auto-set promo badge if entering price and badge is empty
                            badge: (val && !prev.badge) ? 'PROMO 🔥' : prev.badge,
                            badge_color: (val && !prev.badge_color) ? 'bg-[#ef4444]' : prev.badge_color
                          }))
                        }} 
                        className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors" 
                      />
                    </div>
                  </div>

                  {/* Flavors Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em]">Goûts (Options)</label>
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, flavors: [...prev.flavors, { name: '', detail: '' }] }))}
                        className="text-[#39ff14] hover:bg-[#39ff14]/10 p-1.5 rounded transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                      >
                        <Plus size={16} /> Ajouter
                      </button>
                    </div>

                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {formData.flavors.map((flavor, index) => (
                        <div key={index} className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, flavors: prev.flavors.filter((_, i) => i !== index) }))}
                            className="p-3 text-white/30 hover:text-red-500 transition-colors"
                          >
                            <X size={20} />
                          </button>
                          <input 
                            type="text" 
                            value={flavor.name} 
                            placeholder="Menthe"
                            onChange={(e) => {
                              const newFlavors = [...formData.flavors];
                              newFlavors[index].name = e.target.value;
                              setFormData(prev => ({ ...prev, flavors: newFlavors }));
                            }} 
                            className="bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors flex-[2]" 
                          />
                          <input 
                            type="text" 
                            value={flavor.detail} 
                            placeholder="p.ex. 20 g"
                            onChange={(e) => {
                              const newFlavors = [...formData.flavors];
                              newFlavors[index].detail = e.target.value;
                              setFormData(prev => ({ ...prev, flavors: newFlavors }));
                            }} 
                            className="bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors flex-1" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Média Section */}
                  <div>
                    <h3 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em] mb-4">Galerie Photo (1-5)</h3>
                    <div className="grid grid-cols-5 gap-2 mb-6">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <div key={index} className="relative aspect-square bg-[#111] border border-white/5 group overflow-hidden flex items-center justify-center">
                          {formData.images[index] ? (
                            <>
                              <img src={formData.images[index]} className="w-full h-full object-contain" alt={`Photo ${index + 1}`} />
                              <button 
                                type="button" 
                                onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                                className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <X size={10} className="text-white" />
                              </button>
                            </>
                          ) : (
                            <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors">
                              <Plus size={20} className={`text-white/10 group-hover:text-[#39ff14] transition-colors ${uploading ? 'animate-pulse' : ''}`} />
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleUpload(e)} 
                                className="hidden" 
                                disabled={uploading}
                              />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>

                    <h3 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em] mb-4">Vidéo du Produit</h3>
                    <div className="relative aspect-video bg-[#111] border border-white/5 overflow-hidden flex items-center justify-center group">
                      {formData.video_url ? (
                        <div className="w-full h-full relative">
                          <video src={formData.video_url} className="w-full h-full object-cover opacity-50" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Play size={40} className="text-white/20 group-hover:text-[#39ff14] transition-colors" />
                          </div>
                          <button 
                             type="button" 
                             onClick={() => setFormData(prev => ({ ...prev, video_url: '' }))}
                             className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full z-20 hover:scale-110 transition-transform shadow-lg"
                          >
                             <X size={14} className="text-white" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors p-8">
                           <Upload size={32} className="text-[#a1a1aa] group-hover:text-[#39ff14] mb-4 transition-colors" />
                           <span className="text-[10px] font-bold text-[#a1a1aa] group-hover:text-white uppercase tracking-[0.2em] transition-colors">Ajouter une vidéo</span>
                           <input type="file" accept="video/*" onChange={(e) => handleUpload(e, true)} className="hidden" disabled={uploading} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em] mb-4">Marketing & Style</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase">Badge Texte</label>
                          <button type="button" onClick={() => setIsAddingNewBadgeText(!isAddingNewBadgeText)} className="text-[#39ff14] hover:bg-[#39ff14]/10 p-1 rounded transition-colors">
                            {isAddingNewBadgeText ? <X size={12} /> : <Plus size={12} />}
                          </button>
                        </div>
                        {isAddingNewBadgeText ? (
                          <input type="text" value={formData.badge} placeholder="ex: -15%" onChange={e => setFormData(prev => ({ ...prev, badge: e.target.value }))} className="w-full bg-[#111] border border-[#39ff14]/50 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors" />
                        ) : (
                          <select value={formData.badge} onChange={e => setFormData(prev => ({ ...prev, badge: e.target.value }))} className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors appearance-none cursor-pointer">
                            <option value="">Aucun Badge</option>
                            <option value="NOUVEAU">NOUVEAU</option>
                            <option value="PROMO 🔥">PROMO 🔥</option>
                            <option value="TOP VENTE">TOP VENTE</option>
                            <option value="STOCK LIMITÉ">STOCK LIMITÉ</option>
                            <option value="OFFRE SPÉCIALE">OFFRE SPÉCIALE</option>
                            {formData.badge && !['', 'NOUVEAU', 'PROMO 🔥', 'TOP VENTE', 'STOCK LIMITÉ', 'OFFRE SPÉCIALE'].includes(formData.badge) && (
                              <option value={formData.badge}>{formData.badge}</option>
                            )}
                          </select>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase">Couleur Badge</label>
                          <button type="button" onClick={() => setIsAddingNewBadgeColor(!isAddingNewBadgeColor)} className="text-[#39ff14] hover:bg-[#39ff14]/10 p-1 rounded transition-colors">
                            {isAddingNewBadgeColor ? <X size={12} /> : <Plus size={12} />}
                          </button>
                        </div>
                        {isAddingNewBadgeColor ? (
                          <input type="text" value={formData.badge_color} placeholder="bg-[#ff00ff]" onChange={e => setFormData(prev => ({ ...prev, badge_color: e.target.value }))} className="w-full bg-[#111] border border-[#39ff14]/50 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors" />
                        ) : (
                          <select value={formData.badge_color} onChange={e => setFormData(prev => ({ ...prev, badge_color: e.target.value }))} className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors appearance-none cursor-pointer">
                            <option value="bg-[#ef4444]">Rouge Mat</option>
                            <option value="bg-[#39ff14] text-black">Vert Néon</option>
                            <option value="bg-[#ff00ff]">Magenta Flash</option>
                            <option value="bg-yellow-500 text-black">Jaune Soleil</option>
                            <option value="bg-white text-black">Blanc Classique</option>
                            {formData.badge_color && !['bg-[#ef4444]', 'bg-[#39ff14] text-black', 'bg-[#ff00ff]', 'bg-yellow-500 text-black', 'bg-white text-black'].includes(formData.badge_color) && (
                              <option value={formData.badge_color}>{formData.badge_color}</option>
                            )}
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase">Couleur Effet Glow</label>
                          <button type="button" onClick={() => setIsAddingNewGlow(!isAddingNewGlow)} className="text-[#39ff14] hover:bg-[#39ff14]/10 p-1 rounded transition-colors">
                            {isAddingNewGlow ? <X size={12} /> : <Plus size={12} />}
                          </button>
                        </div>
                        {isAddingNewGlow ? (
                          <input type="text" value={formData.glow_color} placeholder="box-glow-green-hover" onChange={e => setFormData(prev => ({ ...prev, glow_color: e.target.value }))} className="w-full bg-[#111] border border-[#39ff14]/50 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors" />
                        ) : (
                          <select value={formData.glow_color} onChange={e => setFormData(prev => ({ ...prev, glow_color: e.target.value }))} className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors appearance-none cursor-pointer">
                            <option value="box-glow-green-hover">Glow Vert</option>
                            <option value="box-glow-pink-hover">Glow Magenta</option>
                            <option value="box-glow-yellow-hover">Glow Jaune</option>
                            <option value="box-glow-red-hover">Glow Rouge</option>
                            {formData.glow_color && !['box-glow-green-hover', 'box-glow-pink-hover', 'box-glow-yellow-hover', 'box-glow-red-hover'].includes(formData.glow_color) && (
                              <option value={formData.glow_color}>{formData.glow_color}</option>
                            )}
                          </select>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-white/40 uppercase mb-2">Quantité Disponible</label>
                        <input type="number" value={formData.stock_quantity} onChange={e => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) }))} className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#39ff14] outline-none transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em] mb-4">Restrictions et Visibilité</h3>
                    <div className="space-y-4 bg-white/[0.02] border border-white/5 p-4 rounded-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Visible dans la boutique</span>
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, is_visible: !prev.is_visible }))}
                          className={`w-12 h-6 rounded-full relative transition-colors ${formData.is_visible ? 'bg-[#39ff14]' : 'bg-white/10'}`}
                        >
                          <motion.div animate={{ x: formData.is_visible ? 26 : 4 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          id="ageLimit"
                          checked={formData.is_18_plus} 
                          onChange={e => setFormData(prev => ({ ...prev, is_18_plus: e.target.checked }))} 
                          className="w-5 h-5 accent-[#39ff14] bg-[#111] border-white/10 rounded cursor-pointer"
                        />
                        <label htmlFor="ageLimit" className="text-[10px] font-bold text-white/60 uppercase tracking-widest cursor-pointer">Vente interdite aux moins de 18 ans.</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="lg:col-span-2 pt-6">
                  <button 
                    disabled={isPending}
                    type="submit" 
                    className={`w-full bg-[#39ff14] hover:bg-[#32e612] text-black font-heading text-xl py-5 uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(57,255,20,0.2)] flex items-center justify-center gap-3 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isPending ? (
                      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      editingProduct ? 'Enregistrer les modifications' : 'Créer le produit'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN MODAL */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdminModalOpen(false)} className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-[#0f0f0f] border border-black/10 dark:border-white/10 p-5 sm:p-8 relative shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-heading uppercase tracking-tighter mb-6 sm:mb-8 text-black dark:text-white">Nouvel Administrateur</h2>
              <form onSubmit={handleAddAdmin} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest mb-1">Nom</label>
                  <input type="text" required value={adminFormData.name} onChange={e => setAdminFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-gray-50 dark:bg-black border border-black/10 dark:border-white/10 px-4 py-3 text-sm focus:border-[#39ff14] dark:focus:border-[#39ff14] outline-none text-black dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest mb-1">Passcode</label>
                  <input type="password" required value={adminFormData.passcode} onChange={e => setAdminFormData(prev => ({ ...prev, passcode: e.target.value }))} className="w-full bg-gray-50 dark:bg-black border border-black/10 dark:border-white/10 px-4 py-3 text-sm focus:border-[#39ff14] dark:focus:border-[#39ff14] outline-none text-black dark:text-white tracking-widest" />
                </div>
                <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-heading py-4 uppercase hover:bg-[#39ff14] hover:text-black dark:hover:bg-[#39ff14] dark:hover:text-black transition-colors">
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
