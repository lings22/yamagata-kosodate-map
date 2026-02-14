'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export type Store = {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  business_hours?: string
  has_nursing_room: boolean
  nursing_room_detail: string | null
  has_diaper_changing: boolean
  diaper_changing_detail: string | null
  has_chair_0_6m: boolean
  has_chair_6_18m: boolean
  has_chair_18m_3y: boolean
  has_chair_3y_plus: boolean
  chair_count_0_6m?: number
  chair_count_6_18m?: number
  chair_count_18m_3y?: number
  chair_count_3y_plus?: number
  has_tatami_room: boolean
  stroller_accessible: boolean
  posted_by?: string
  device_id?: string
  has_parking: boolean
  parking_detail: string | null
  has_private_room: boolean
  private_room_detail: string | null
  comment: string | null
  likes_count: number
  created_at: string
  updated_at: string
}

export function useStores() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .order('likes_count', { ascending: false })
          .order('created_at', { ascending: false })

        if (error) throw error

        setStores(data || [])
      } catch (err) {
        setError(err as Error)
        console.error('店舗取得エラー:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  return { stores, loading, error }
}