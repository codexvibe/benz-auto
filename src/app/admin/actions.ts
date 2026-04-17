'use server'

import { z } from 'zod'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const loginSchema = z.object({
  passcode: z.string().min(1, 'Passcode is required'),
})

export async function loginAction(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    passcode: formData.get('passcode'),
  })

  if (!validatedFields.success) {
    return { error: 'Passcode requis' }
  }

  const { passcode } = validatedFields.data

  if (passcode === process.env.ADMIN_PASSCODE) {
    await createSession('admin')
    redirect('/admin/dashboard')
  }

  return { error: 'Passcode incorrect' }
}

export async function logoutAction() {
  await deleteSession()
  redirect('/admin')
}

// Product Management Actions
export async function createProductAction(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const price = formData.get('price') as string
  const old_price = formData.get('old_price') as string
  const badge = formData.get('badge') as string
  const badge_color = formData.get('badge_color') as string
  const glow_color = formData.get('glow_color') as string
  const image_url = formData.get('image_url') as string

  const { data, error } = await supabase
    .from('products')
    .insert([
      { name, category, price, old_price, badge, badge_color, glow_color, image_url }
    ])
    .select()

  if (error) {
    console.error('Error creating product:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  return { success: true, data }
}

export async function updateProductAction(id: number, formData: FormData) {
  const supabase = await createClient()
  
  const updates: any = {}
  formData.forEach((value, key) => {
    if (key !== 'id') updates[key] = value
  })

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating product:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  return { success: true, data }
}

export async function deleteProductAction(id: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

// Order Management Actions
export async function getOrdersAction() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function updateOrderStatusAction(id: number, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/dashboard')
  return { success: true }
}

// Analytics Actions
export async function getDashboardStatsAction() {
  const supabase = await createClient()
  
  // Get all orders to calculate revenue
  const { data: orders } = await supabase.from('orders').select('product_price, status')
  const { data: products } = await supabase.from('products').select('name, views_count, price')

  const totalRevenue = orders?.reduce((acc, order) => {
    // Only count confirmed or delivered orders for revenue? 
    // User didn't specify, so I'll count all for now, but show logic.
    const price = parseInt(order.product_price?.replace(/[^0-9]/g, '') || '0')
    return acc + price
  }, 0) || 0

  const totalOrders = orders?.length || 0
  
  // Sort products by views
  const mostViewed = products?.sort((a,b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5) || []

  return {
    totalRevenue,
    totalOrders,
    mostViewed,
    productsCount: products?.length || 0
  }
}

export async function incrementProductViewAction(id: number) {
  const supabase = await createClient()
  // We use rpc for atomic increment or just fetch -> increment if no rpc available
  // To keep it simple, I'll fetch and update
  const { data } = await supabase.from('products').select('views_count').eq('id', id).single()
  await supabase.from('products').update({ views_count: (data?.views_count || 0) + 1 }).eq('id', id)
}

// Team Management Actions
export async function getAdminsAction() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('admins').select('*')
  if (error) return { error: error.message }
  return { data }
}

export async function addAdminAction(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const passcode = formData.get('passcode') as string

  const { error } = await supabase.from('admins').insert([{ name, passcode }])
  if (error) return { error: error.message }
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function deleteAdminAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('admins').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/dashboard')
  return { success: true }
}

// Storage Action
export async function uploadImageAction(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('file') as File
  
  if (!file) return { error: 'Aucun fichier fourni' }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
  const filePath = `products/${fileName}`

  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, file)

  if (error) {
    console.error('Upload error:', error)
    return { error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(filePath)

  return { publicUrl }
}
