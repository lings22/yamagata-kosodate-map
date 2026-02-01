'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useStores, Store } from '@/hooks/useStores'
import StoreList from '@/components/StoreList'
import Footer from '@/components/Footer'

export default function StoresPage() {
  const { stores, loading } = useStores()
  const [searchQuery, setSearchQuery] = useState('')

  const [filters, setFilters] = useState({
    hasChair: false,
    hasParking: false,
    hasNursingRoom: false,
    hasDiaperChanging: false,
    strollerAccessible: false,
  })

  const filteredStores = useMemo(() => {
    let result = stores

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(store => 
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query) ||
        (store.comment && store.comment.toLowerCase().includes(query))
      )
    }

    const hasActiveFilters = filters.hasChair || filters.hasParking || 
      filters.hasNursingRoom || filters.hasDiaperChanging || filters.strollerAccessible

    if (hasActiveFilters) {
      result = result.filter(store => {
        if (filters.hasChair) {
          if (!store.has_chair_0_6m && !store.has_chair_6_18m && 
              !store.has_chair_18m_3y && !store.has_chair_3y_plus) {
            return false
          }
        }
        if (filters.hasParking && !store.has_parking) return false
        if (filters.hasNursingRoom && !store.has_nursing_room) return false
        if (filters.hasDiaperChanging && !store.has_diaper_changing) return false
        if (filters.strollerAccessible && !store.stroller_accessible) return false
        return true
      })
    }

    return result
  }, [stores, filters, searchQuery])

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  const handleStoreClick = (store: Store) => {
    window.location.href = `/stores/${store.id}`
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                山形子育てマップ
              </h1>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                β版
              </span>
            </Link>
            
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 rounded-lg transition"
            >
              🗺️ 地図で見る
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">店舗一覧</h2>
          <p className="text-gray-600">全{filteredStores.length}件の店舗</p>
        </div>

        {/* 検索とフィルター */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* 検索窓 */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="店舗名・住所で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-[#333333]"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* フィルター */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">フィルター</h3>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition">
                <input 
                  type="checkbox" 
                  className="rounded"
                  checked={filters.hasChair}
                  onChange={() => handleFilterChange('hasChair')}
                />
                <span className="text-[#333333]">子ども椅子あり</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition">
                <input 
                  type="checkbox" 
                  className="rounded"
                  checked={filters.hasParking}
                  onChange={() => handleFilterChange('hasParking')}
                />
                <span className="text-[#333333]">駐車場あり</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition">
                <input 
                  type="checkbox" 
                  className="rounded"
                  checked={filters.hasNursingRoom}
                  onChange={() => handleFilterChange('hasNursingRoom')}
                />
                <span className="text-[#333333]">授乳室あり</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition">
                <input 
                  type="checkbox" 
                  className="rounded"
                  checked={filters.hasDiaperChanging}
                  onChange={() => handleFilterChange('hasDiaperChanging')}
                />
                <span className="text-[#333333]">おむつ替え台あり</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition">
                <input 
                  type="checkbox" 
                  className="rounded"
                  checked={filters.strollerAccessible}
                  onChange={() => handleFilterChange('strollerAccessible')}
                />
                <span className="text-[#333333]">ベビーカー入店可</span>
              </label>
            </div>
          </div>
        </div>

        {/* 店舗一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              onClick={() => handleStoreClick(store)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-xl text-gray-800 flex-1">
                  {store.name}
                </h3>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100">
                  <span className="text-lg">❤️</span>
                  <span className="text-sm font-semibold text-pink-800">{store.likes_count}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                📍 {store.address}
              </p>

              <div className="flex flex-wrap gap-2">
                {store.has_nursing_room && (
                  <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                    🍼 授乳室
                  </span>
                )}
                {store.has_diaper_changing && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    👶 おむつ替え
                  </span>
                )}
                {(store.has_chair_0_6m || store.has_chair_6_18m || store.has_chair_18m_3y || store.has_chair_3y_plus) && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    🪑 子ども椅子
                  </span>
                )}
                {store.stroller_accessible && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    🚼 ベビーカーOK
                  </span>
                )}
                {store.has_parking && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    🅿️ 駐車場
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}