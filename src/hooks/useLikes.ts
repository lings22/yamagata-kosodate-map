'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useLikes(storeId: string) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(false)
  
// 毎レンダーで createClient() が評価されないように遅延初期化
const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
if (!supabaseRef.current) {
  supabaseRef.current = createClient()
}
const supabase = supabaseRef.current

  useEffect(() => {
    let isMounted = true
    
    const fetchLikeStatus = async () => {
      // user.id で比較（userオブジェクト全体ではなく）
      if (!user?.id) return

      try {
        const { data: likeData } = await supabase
          .from('store_likes')
          .select('id')
          .eq('store_id', storeId)
          .eq('user_id', user.id)
          .maybeSingle()  // single() → maybeSingle() に変更（データがない場合もエラーにならない）

        if (isMounted) {
          setIsLiked(!!likeData)
        }
      } catch (err) {
        console.error('いいね状態取得エラー:', err)
      }
    }

    fetchLikeStatus()
    
    return () => {
      isMounted = false
    }
  }, [storeId, user?.id, supabase])  // user → user?.id に変更

  const toggleLike = useCallback(async () => {
    if (!user?.id) {
      alert('いいねするにはログインが必要です')
      window.location.replace('/login')
      return
    }

    setLoading(true)
    try {
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
  }, [user?.id, storeId, isLiked, supabase])

  return { isLiked, likesCount, loading, toggleLike }
}