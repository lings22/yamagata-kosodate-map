'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDevice } from '@/contexts/DeviceContext'
import { createClient } from '@/lib/supabase'

type DuplicateStore = {
  id: string
  name: string
  address: string
}

export default function AddStorePage() {
  const { deviceId } = useDevice()
  const router = useRouter()
  const autocompleteInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [duplicateStore, setDuplicateStore] = useState<DuplicateStore | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    phone: '',
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
    comment: '',
    business_hours: '',
  })

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=ja`
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      script.onload = () => {
        initAutocomplete()
      }
    } else {
      initAutocomplete()
    }
  }, [])

  const initAutocomplete = () => {
    if (!autocompleteInputRef.current || !window.google) return

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInputRef.current,
      {
        componentRestrictions: { country: 'jp' },
        fields: ['place_id', 'name', 'formatted_address', 'geometry', 'formatted_phone_number'],
        types: ['establishment'],
      }
    )

    autocomplete.setBounds(
      new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(38.2, 140.3),
        new window.google.maps.LatLng(38.3, 140.4)
      )
    )

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()

      if (!place.geometry || !place.geometry.location) {
        alert('店舗情報の取得に失敗しました')
        return
      }

      const location = place.geometry.location
      const lat = location.lat
      const lng = location.lng

      const latitude = typeof lat === 'function' ? lat() : (lat || 0)
      const longitude = typeof lng === 'function' ? lng() : (lng || 0)

      setSelectedPlace(place)
      setFormData(prev => ({
        ...prev,
        name: place.name || '',
        address: place.formatted_address || '',
        latitude: latitude,
        longitude: longitude,
        phone: place.formatted_phone_number || '',
      }))
    })
  }

  const handleManualInput = () => {
    setShowManualInput(true)
  }

  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()

      if (data.status === 'OK' && data.results[0]) {
        const location = data.results[0].geometry.location
        return { lat: location.lat, lng: location.lng }
      }
      return null
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  const checkDuplicate = async (lat: number, lng: number) => {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('stores')
        .select('*')

      if (error) throw error

      if (!data) return null

      const nearby = data.filter((store: any) => {
        const distance = Math.sqrt(
          Math.pow(store.latitude - lat, 2) + Math.pow(store.longitude - lng, 2)
        ) * 111000

        return distance <= 50
      })

      return nearby.length > 0 ? nearby[0] : null
    } catch (error) {
      console.error('重複チェックエラー:', error)
      return null
    }
  }

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

      if (showManualInput && (!lat || !lng)) {
        const coords = await geocodeAddress(formData.address)
        if (!coords) {
          alert('住所から位置情報を取得できませんでした。住所を確認してください。')
          setLoading(false)
          return
        }
        lat = coords.lat
        lng = coords.lng
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))
      }

      const duplicate = await checkDuplicate(lat, lng)
      if (duplicate) {
        setDuplicateStore(duplicate)
        setShowDuplicateModal(true)
        setLoading(false)
        return
      }

      await saveStore(lat, lng)
    } catch (error) {
      console.error('エラー:', error)
      alert('エラーが発生しました。もう一度お試しください。')
      setLoading(false)
    }
  }

  const saveStore = async (lat: number, lng: number) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('stores').insert({
        name: formData.name,
        address: formData.address,
        latitude: lat,
        longitude: lng,
        has_chair_0_6m: formData.has_child_chair || formData.chair_count_0_6m > 0,
        has_chair_6_18m: formData.has_child_chair || formData.chair_count_6_18m > 0,
        has_chair_18m_3y: formData.has_child_chair || formData.chair_count_18m_3y > 0,
        has_chair_3y_plus: formData.has_child_chair || formData.chair_count_3y_plus > 0,
        chair_count_0_6m: formData.has_child_chair ? formData.chair_count_0_6m : 0,
        chair_count_6_18m: formData.has_child_chair ? formData.chair_count_6_18m : 0,
        chair_count_18m_3y: formData.has_child_chair ? formData.chair_count_18m_3y : 0,
        chair_count_3y_plus: formData.has_child_chair ? formData.chair_count_3y_plus : 0,
        has_tatami_room: formData.has_tatami_room,
        has_parking: formData.has_parking,
        parking_detail: formData.has_parking ? formData.parking_detail : null,
        has_nursing_room: formData.has_nursing_room,
        nursing_room_detail: formData.has_nursing_room ? formData.nursing_room_detail : null,
        has_diaper_changing: formData.has_diaper_changing,
        diaper_changing_detail: formData.has_diaper_changing ? formData.diaper_changing_detail : null,
        stroller_accessible: formData.stroller_accessible,
        comment: formData.comment || null,
        device_id: deviceId,
      })

      if (error) throw error

      alert('店舗を追加しました！')
      router.push('/')
    } catch (error) {
      console.error('保存エラー:', error)
      alert('保存に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  const handleForceSave = async () => {
    setShowDuplicateModal(false)
    setLoading(true)
    await saveStore(formData.latitude, formData.longitude)
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
            <Link
              href="/"
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 rounded-lg transition"
            >
              🗺️ 地図に戻る
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">店舗を追加</h2>

          <form onSubmit={handleSubmit}>
            {/* Google Places Autocomplete */}
            {!showManualInput ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 店舗名で検索
                </label>
                <input
                  ref={autocompleteInputRef}
                  type="text"
                  placeholder="店舗名を入力してください（例：○○食堂）"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-[#333333]"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Googleから店舗情報を自動取得します
                </p>
                <button
                  type="button"
                  onClick={handleManualInput}
                  className="mt-3 text-sm text-orange-500 hover:underline"
                >
                  見つからない場合は手動で入力 →
                </button>
              </div>
            ) : (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">店舗名 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例：○○食堂"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-[#333333]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">住所 *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="例：山形県山形市○○1-2-3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-[#333333]"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="text-sm text-orange-500 hover:underline"
                >
                  ← Google検索に戻る
                </button>
              </div>
            )}

            {/* 店舗情報が選択された場合、設備フォームを表示 */}
            {(selectedPlace || showManualInput) && (
              <>
                {selectedPlace && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg">
                    <p className="font-semibold text-green-800">✅ {formData.name}</p>
                    <p className="text-sm text-green-700">{formData.address}</p>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">設備情報</h3>

                  {/* 子ども椅子 */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={formData.has_child_chair}
                        onChange={(e) => setFormData({ ...formData, has_child_chair: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">🪑 子ども椅子あり</span>
                    </label>
                    {formData.has_child_chair && (
                      <div className="ml-6 space-y-2 mt-2">
                        <p className="text-sm text-gray-600 mb-2">年齢別の台数（わかる範囲で）:</p>
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
                    onClick={() => router.push('/')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? '保存中...' : '店舗を追加'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>

      {/* 重複チェックモーダル */}
      {showDuplicateModal && duplicateStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ⚠️ 重複の可能性があります
            </h3>
            <p className="text-gray-600 mb-4">
              この店舗は既に登録されている可能性があります
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-semibold text-gray-800">{duplicateStore.name}</p>
              <p className="text-sm text-gray-600">{duplicateStore.address}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href={`/stores/${duplicateStore.id}`}
                className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-center transition"
              >
                既存店舗を見る
              </Link>
              <button
                onClick={handleForceSave}
                className="w-full px-4 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition"
              >
                それでも追加する
              </button>
              <button
                onClick={() => setShowDuplicateModal(false)}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}