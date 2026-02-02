'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Store } from '@/hooks/useStores'
import { useLikes } from '@/hooks/useLikes'
import Footer from '@/components/Footer'

export default function StoreDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const storeId = params.id as string
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const { isLiked, likesCount, toggleLike } = useLikes(storeId)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .single()

        if (error) throw error
        setStore(data)
      } catch (err) {
        console.error('店舗取得エラー:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStore()
  }, [storeId])

  const handleDelete = async () => {
    if (!confirm('本当にこの店舗を削除しますか？この操作は取り消せません。')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId)

      if (error) throw error

      alert('店舗を削除しました')
      router.push('/')
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">店舗が見つかりませんでした</p>
          <Link
            href="/stores"
            className="px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-lg transition"
          >
            一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  const displayLikesCount = likesCount || store.likes_count
  const hasChair = store.has_chair_0_6m || store.has_chair_6_18m || store.has_chair_18m_3y || store.has_chair_3y_plus

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                山形てくてくマップ
              </h1>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                β版
              </span>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {user && (
                <Link
                  href="/add-store"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 rounded-lg transition"
                >
                  <span className="hidden sm:inline">➕ 店舗を追加</span>
                  <span className="sm:hidden">➕</span>
                </Link>
              )}
              <Link
                href="/stores"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                📋 一覧
              </Link>
              <Link
                href="/"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 rounded-lg transition"
              >
                🗺️ 地図
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 店舗名といいねボタン */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              {store.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={toggleLike}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-pink-100 hover:bg-pink-200 transition"
              >
                <span className="text-2xl">{isLiked ? '❤️' : '🤍'}</span>
                <span className="text-lg font-semibold text-pink-800">{displayLikesCount}</span>
              </button>
              {user && (isAdmin || store.posted_by === user.id) && (
                <>
                  <Link
                    href={`/stores/${store.id}/edit`}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg transition"
                  >
                    <span className="hidden sm:inline">✏️ 編集</span>
                    <span className="sm:hidden">✏️</span>
                  </Link>
                  {isAdmin && (
                    <button
                      onClick={handleDelete}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-semibold rounded-lg transition"
                    >
                      <span className="hidden sm:inline">🗑️ 削除</span>
                      <span className="sm:hidden">🗑️</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-xl">📍</span>
              <span className="flex-1">{store.address}</span>
            </div>
          </div>
        </div>

        {/* 設備情報 */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">設備情報</h2>
          
          <div className="space-y-6">
            {/* 授乳室 */}
            {store.has_nursing_room && (
              <div className="border-l-4 border-pink-400 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🍼</span>
                  <h3 className="text-lg font-semibold text-gray-800">授乳室</h3>
                </div>
                {store.nursing_room_detail && (
                  <p className="text-gray-600 ml-8">{store.nursing_room_detail}</p>
                )}
              </div>
            )}

            {/* 座敷 */}
            {store.has_tatami_room && (
              <div className="border-l-4 border-amber-400 pl-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍵</span>
                  <h3 className="text-lg font-semibold text-gray-800">座敷あり</h3>
                </div>
              </div>
            )}

            {/* おむつ替え台 */}
            {store.has_diaper_changing && (
              <div className="border-l-4 border-blue-400 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👶</span>
                  <h3 className="text-lg font-semibold text-gray-800">おむつ替え台</h3>
                </div>
                {store.diaper_changing_detail && (
                  <p className="text-gray-600 ml-8">{store.diaper_changing_detail}</p>
                )}
              </div>
            )}

            {/* 子ども椅子 */}
            {hasChair && (
              <div className="border-l-4 border-green-400 pl-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪑</span>
                  <h3 className="text-lg font-semibold text-gray-800">子ども椅子: あり</h3>
                </div>
                <p className="text-sm text-gray-500 italic ml-10 mt-2">
                  ※台数は未確認です。情報お待ちしております
                </p>
              </div>
            )}

            {/* ベビーカー */}
            {store.stroller_accessible && (
              <div className="border-l-4 border-purple-400 pl-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚼</span>
                  <h3 className="text-lg font-semibold text-gray-800">ベビーカー入店可</h3>
                </div>
              </div>
            )}

            {/* 駐車場 */}
            {store.has_parking && (
              <div className="border-l-4 border-orange-400 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🅿️</span>
                  <h3 className="text-lg font-semibold text-gray-800">駐車場</h3>
                </div>
                {store.parking_detail && (
                  <p className="text-gray-600 ml-8">{store.parking_detail}</p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* コメント */}
        {store.comment && (
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">コメント</h2>
            <p className="text-gray-700 leading-relaxed">{store.comment}</p>
          </div>
        )}

        {/* 地図 */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">アクセス</h2>
          <div className="w-full h-64 sm:h-96 rounded-lg overflow-hidden">
            <iframe
              src={`https://maps.google.com/maps?q=${store.latitude},${store.longitude}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}