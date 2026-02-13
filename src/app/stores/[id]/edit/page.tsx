'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { Store } from '@/hooks/useStores'

export default function EditStorePage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const storeId = params.id as string
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [store, setStore] = useState<Store | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    has_child_chair: false,
    chair_count_0_6m: 0,
    chair_count_6_18m: 0,
    chair_count_18m_3y: 0,
    chair_count_3y_plus: 0,
    has_tatami_room: false,
    has_parking: false,
    parking_detail: '',
    has_nursing_room: false,
    nursing_room_detail: '',
    has_diaper_changing: false,
    diaper_changing_detail: '',
    stroller_accessible: false,
    has_private_room: false,
    private_room_detail: '',
    comment: '',
    business_hours: '',
  })

  useEffect(() => {
    if (authLoading) return    // ← この1行を追加

    if (!user) {
      router.replace('/login')
      return
    }

    const fetchStore = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .single()

        if (error) throw error

        if (!data) {
          alert('店舗が見つかりませんでした')
          router.push('/')
          return
        }

        if (!isAdmin && data.posted_by !== user.id) {
          alert('この店舗を編集する権限がありません')
          router.push(`/stores/${storeId}`)
          return
        }

        setStore(data)
        setFormData({
          name: data.name || '',
          address: data.address || '',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          has_child_chair: data.has_chair_0_6m || data.has_chair_6_18m || data.has_chair_18m_3y || data.has_chair_3y_plus,
          chair_count_0_6m: data.chair_count_0_6m || 0,
          chair_count_6_18m: data.chair_count_6_18m || 0,
          chair_count_18m_3y: data.chair_count_18m_3y || 0,
          chair_count_3y_plus: data.chair_count_3y_plus || 0,
          has_tatami_room: data.has_tatami_room || false,
          has_parking: data.has_parking || false,
          parking_detail: data.parking_detail || '',
          has_nursing_room: data.has_nursing_room || false,
          nursing_room_detail: data.nursing_room_detail || '',
          has_diaper_changing: data.has_diaper_changing || false,
          diaper_changing_detail: data.diaper_changing_detail || '',
          stroller_accessible: data.stroller_accessible || false,
          has_private_room: data.has_private_room || false,
          private_room_detail: data.private_room_detail || '',
          comment: data.comment || '',
          business_hours: data.business_hours || '',
        })
      } catch (error) {
        console.error('店舗取得エラー:', error)
        alert('店舗情報の取得に失敗しました')
        router.push('/')
      } finally {
        setPageLoading(false)
      }
    }

    fetchStore()
  }, [authLoading, user, isAdmin, router, storeId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.address) {
      alert('店舗名と住所は必須です')
      return
    }

    setLoading(true)

    try {
      let lat = formData.latitude
      let lng = formData.longitude

      // 住所が変更されていた場合、Geocodingで新しい座標を取得
      if (store && formData.address !== store.address) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(formData.address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        )
        const data = await response.json()

        if (data.status === 'OK' && data.results[0]) {
          lat = data.results[0].geometry.location.lat
          lng = data.results[0].geometry.location.lng
        } else {
          alert('新しい住所から位置情報を取得できませんでした。住所を確認してください。')
          setLoading(false)
          return
        }
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('stores')
        .update({
          name: formData.name,
          address: formData.address,
          latitude: lat,
          longitude: lng,
          has_chair_0_6m: formData.has_child_chair || formData.chair_count_0_6m > 0,
          has_chair_6_18m: formData.has_child_chair || formData.chair_count_6_18m > 0,
          has_chair_18m_3y: formData.has_child_chair || formData.chair_count_18m_3y > 0,
          has_chair_3y_plus: formData.has_child_chair || formData.chair_count_3y_plus > 0,
          chair_count_0_6m: formData.chair_count_0_6m,
          chair_count_6_18m: formData.chair_count_6_18m,
          chair_count_18m_3y: formData.chair_count_18m_3y,
          chair_count_3y_plus: formData.chair_count_3y_plus,
          has_tatami_room: formData.has_tatami_room,
          has_parking: formData.has_parking,
          parking_detail: formData.parking_detail,
          has_nursing_room: formData.has_nursing_room,
          nursing_room_detail: formData.nursing_room_detail,
          has_diaper_changing: formData.has_diaper_changing,
          diaper_changing_detail: formData.diaper_changing_detail,
          stroller_accessible: formData.stroller_accessible,
          has_private_room: formData.has_private_room,
          private_room_detail: formData.private_room_detail,
          comment: formData.comment,
          business_hours: formData.business_hours,
        })
        .eq('id', storeId)

      if (error) throw error

      alert('店舗情報を更新しました！')
      router.push(`/stores/${storeId}`)
    } catch (error) {
      console.error('更新エラー:', error)
      alert('エラーが発生しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user || !store) {
    return null
  }

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
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">店舗情報を編集</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                店舗名 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-[#333333]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                住所 *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-[#333333]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🕐 営業時間
              </label>
              <textarea
                value={formData.business_hours}
                onChange={(e) => setFormData({ ...formData, business_hours: e.target.value })}
                placeholder="例：11:00〜15:00 / 17:00〜22:00（定休日: 水曜）"
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-[#333333]"
              />
            </div>

            {/* 設備情報 */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">設備情報</h3>

              {/* 子ども椅子 */}
              <div className="mb-6">
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.has_child_chair}
                    onChange={(e) => setFormData({ ...formData, has_child_chair: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">🪑 子ども椅子あり</span>
                </label>
                {formData.has_child_chair && (
                  <div className="ml-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-700 w-32">0-6ヶ月:</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.chair_count_0_6m}
                        onChange={(e) => setFormData({ ...formData, chair_count_0_6m: parseInt(e.target.value) || 0 })}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-600">台</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-700 w-32">6-18ヶ月:</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.chair_count_6_18m}
                        onChange={(e) => setFormData({ ...formData, chair_count_6_18m: parseInt(e.target.value) || 0 })}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-600">台</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-700 w-32">18ヶ月-3歳:</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.chair_count_18m_3y}
                        onChange={(e) => setFormData({ ...formData, chair_count_18m_3y: parseInt(e.target.value) || 0 })}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-600">台</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-700 w-32">3歳以上:</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.chair_count_3y_plus}
                        onChange={(e) => setFormData({ ...formData, chair_count_3y_plus: parseInt(e.target.value) || 0 })}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-600">台</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 座敷 */}
              <div className="mb-6">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.has_tatami_room}
                    onChange={(e) => setFormData({ ...formData, has_tatami_room: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">🍵 座敷あり</span>
                </label>
              </div>

              {/* 駐車場 */}
              <div className="mb-6">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.has_parking}
                    onChange={(e) => setFormData({ ...formData, has_parking: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">🅿️ 駐車場あり</span>
                </label>
                {formData.has_parking && (
                  <input
                    type="text"
                    value={formData.parking_detail}
                    onChange={(e) => setFormData({ ...formData, parking_detail: e.target.value })}
                    placeholder="詳細（例: 店舗前に20台以上）"
                    className="ml-6 w-full px-3 py-2 border border-gray-300 rounded-lg text-[#333333] text-sm"
                  />
                )}
              </div>

              {/* 授乳室 */}
              <div className="mb-6">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.has_nursing_room}
                    onChange={(e) => setFormData({ ...formData, has_nursing_room: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">🍼 授乳室あり</span>
                </label>
                {formData.has_nursing_room && (
                  <input
                    type="text"
                    value={formData.nursing_room_detail}
                    onChange={(e) => setFormData({ ...formData, nursing_room_detail: e.target.value })}
                    placeholder="詳細（例: オムツ交換台のあり）"
                    className="ml-6 w-full px-3 py-2 border border-gray-300 rounded-lg text-[#333333] text-sm"
                  />
                )}
              </div>

              {/* おむつ替え台 */}
              <div className="mb-6">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.has_diaper_changing}
                    onChange={(e) => setFormData({ ...formData, has_diaper_changing: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">👶 おむつ替え台あり</span>
                </label>
                {formData.has_diaper_changing && (
                  <input
                    type="text"
                    value={formData.diaper_changing_detail}
                    onChange={(e) => setFormData({ ...formData, diaper_changing_detail: e.target.value })}
                    placeholder="詳細（例: トイレ内に設置）"
                    className="ml-6 w-full px-3 py-2 border border-gray-300 rounded-lg text-[#333333] text-sm"
                  />
                )}
              </div>

              {/* ベビーカー */}
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.stroller_accessible}
                    onChange={(e) => setFormData({ ...formData, stroller_accessible: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">🚼 ベビーカー入店可</span>
                </label>
              </div>

              {/* コメント */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💬 コメント
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="店舗に関する口コミを記載してください"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-[#333333]"
                />
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push(`/stores/${storeId}`)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {loading ? '更新中...' : '更新する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}