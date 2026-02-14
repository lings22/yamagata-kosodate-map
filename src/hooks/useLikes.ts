'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

const LIKES_KEY = 'tekuteku_liked_stores'

function getLikedStores(): string[] {
  try {
    const stored = localStorage.getItem(LIKES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveLikedStores(stores: string[]) {
  localStorage.setItem(LIKES_KEY, JSON.stringify(stores))
}

export function useLikes(storeId: string) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!storeId) return
    const liked = getLikedStores()
    setIsLiked(liked.includes(storeId))
  }, [storeId])

  const toggleLike = useCallback(async () => {
    if (!storeId) return

    setLoading(true)
    try {
      const liked = getLikedStores()
      const supabase = createClient()

      if (isLiked) {
        // いいね解除
        const updated = liked.filter(id => id !== storeId)
        saveLikedStores(updated)
        setIsLiked(false)
        setLikesCount(prev => Math.max(0, prev - 1))

        // DB の likes_count を -1
        try {
          await supabase.rpc('decrement_likes', { store_id_input: storeId })
        } catch { /* DB更新失敗してもUI上は反映済み */ }
      } else {
        // いいね追加
        liked.push(storeId)
        saveLikedStores(liked)
        setIsLiked(true)
        setLikesCount(prev => prev + 1)

        // DB の likes_count を +1
        try {
          await supabase.rpc('increment_likes', { store_id_input: storeId })
        } catch { /* DB更新失敗してもUI上は反映済み */ }
      }
    } catch (err) {
      console.error('いいねエラー:', err)
    } finally {
      setLoading(false)
    }
  }, [storeId, isLiked])

  return { isLiked, likesCount, loading, toggleLike }
}