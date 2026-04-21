'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// MOCK MODE: Acciones de auth sin conexión a Supabase.
// Cuando la BD esté lista, restaurar la lógica real usando el cliente de Supabase.

async function fakeLatency(ms = 800) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export async function login(_formData: FormData): Promise<{ error?: string } | never> {
  await fakeLatency()
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(_formData: FormData): Promise<{ error?: string } | never> {
  await fakeLatency()
  revalidatePath('/', 'layout')
  redirect('/check-email')
}

export async function signout() {
  await fakeLatency(300)
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPassword(_formData: FormData): Promise<{ success?: boolean; error?: string }> {
  await fakeLatency()
  return { success: true }
}

export async function updatePassword(_formData: FormData): Promise<{ error?: string } | never> {
  await fakeLatency()
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function updateProfile(_formData: FormData): Promise<{ success?: boolean; error?: string }> {
  await fakeLatency()
  revalidatePath('/', 'layout')
  return { success: true }
}
