'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useLikes(storeId: string) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user) return

      try {
        const supabase = createClient()
        
        const { data: likeData } = await supabase
          .from('store_likes')
          .select('id')
          .eq('store_id', storeId)
          .eq('user_id', user.id)
          .single()

        setIsLiked(!!likeData)
      } catch (err) {
        console.error('いいね状態取得エラー:', err)
      }
    }

    fetchLikeStatus()
  }, [storeId, user])

  const toggleLike = async () => {
    if (!user) {
      alert('いいねするにはログインが必要です')
      window.location.href = '/login'
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()

      if (isLiked) {
        const { error } = await supabase
          .from('store_likes')
          .delete()
          .eq('store_id', storeId)
          .eq('user_id', user.id)

        if (error) throw error
        setIsLiked(false)
        setLikesCount(prev => Math.max(0, prev - 1))
      } else {
        const { error } = await supabase
          .from('store_likes')
          .insert({ store_id: storeId, user_id: user.id })

        if (error) throw error
        setIsLiked(true)
        setLikesCount(prev => prev + 1)
      }
    } catch (err) {
      console.error('いいねエラー:', err)
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return { isLiked, likesCount, loading, toggleLike }
}