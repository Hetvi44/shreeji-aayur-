'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function syncUser() {
  const { userId } = await auth()
  
  if (!userId) throw new Error('Unauthorized')

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    return user
  } catch (error) {
    console.error('[syncUser]', error)
    throw new Error('Failed to sync user')
  }
}

export async function getUserProfile() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { addresses: true },
    })

    if (!user) throw new Error('User not found')
    return user
  } catch (error) {
    console.error('[getUserProfile]', error)
    throw new Error('Failed to fetch profile')
  }
}

export async function updateProfile(data: any) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) return { success: false, error: 'User not found' }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data,
    })
    return { success: true, data: updatedUser }
  } catch (error) {
    console.error('[updateProfile]', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function addAddress(data: any) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) return { success: false, error: 'User not found' }

    const address = await db.address.create({
      data: { ...data, userId: user.id },
    })
    return { success: true, data: address }
  } catch (error) {
    console.error('[addAddress]', error)
    return { success: false, error: 'Failed to add address' }
  }
}

export async function deleteAddress(addressId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    await db.address.delete({
      where: { id: addressId },
    })
    return { success: true }
  } catch (error) {
    console.error('[deleteAddress]', error)
    throw new Error('Failed to delete address')
  }
}

export async function setDefaultAddress(addressId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error('User not found')

    await db.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    })

    return await db.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    })
  } catch (error) {
    console.error('[setDefaultAddress]', error)
    throw new Error('Failed to set default address')
  }
}

export async function getAdminUsers() {
  try {
    const users = await db.user.findMany({
      include: { addresses: true },
      orderBy: { createdAt: 'desc' },
    })
    return users
  } catch (error) {
    console.error('[getAdminUsers]', error)
    throw new Error('Failed to fetch users')
  }
}
