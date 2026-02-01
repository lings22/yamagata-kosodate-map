'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import StoreList from '@/components/StoreList'
import { useStores, Store } from '@/hooks/useStores'
import Footer from '@/components/Footer'

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
        <p className="mt-4 text-gray-600">地図を読み込んでいます...</p>
      </div>
    </div>
  )
})

export default function HomePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { stores } = useStores()
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map')
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    await signOut()
    router.refresh()
  }

  const [filters, setFilters] = useState({
    hasChair: false,
    hasTatamiRoom: false,
    hasParking: false,
    hasNursingRoom: false,
    hasDiaperChanging: false,
    strollerAccessible: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

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

    const hasActiveFilters = filters.hasChair || filters.hasTatamiRoom || filters.hasParking || 
      filters.hasNursingRoom || filters.hasDiaperChanging || filters.strollerAccessible

    if (hasActiveFilters) {
      result = result.filter(store => {
        if (filters.hasChair) {
          if (!store.has_chair_0_6m && !store.has_chair_6_18m && 
              !store.has_chair_18m_3y && !store.has_chair_3y_plus) {
            return false
          }
        }
        if (filters.hasTatamiRoom && !store.has_tatami_room) return false
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
    setSelectedStore(store)
    setActiveTab('map')
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                山形てくてくマップ
              </h1>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                β版
              </span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {user ? (
                <>
                  <Link
                    href="/add-store"
                    className="px-3 sm:px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg transition text-xs sm:text-sm font-medium"
                  >
                    <span className="hidden sm:inline">➕ 店舗を追加</span>
                    <span className="sm:hidden">➕ 追加</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 rounded-lg transition"
                >
                  ログイン
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* スマホ用タブ */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 text-center font-semibold transition ${
              activeTab === 'map'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-600'
            }`}
          >
            🗺️ 地図
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 text-center font-semibold transition ${
              activeTab === 'list'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-600'
            }`}
          >
            📋 一覧 ({filteredStores.length})
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* PC: 左側店舗一覧 */}
        <div className="hidden lg:flex lg:flex-col w-96 border-r border-gray-200 bg-white overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">店舗一覧</h2>
              <p className="text-sm text-gray-600">全{filteredStores.length}件</p>
            </div>
            {/* PC版検索窓 */}
            <div className="relative">
              <input
                type="text"
                placeholder="店舗名・住所で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-[#333333]"
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
          </div>
          <div className="flex-1 overflow-y-auto">
            <StoreList stores={filteredStores} onStoreClick={handleStoreClick} />
          </div>
        </div>

        {/* スマホ: タブで切り替え（一覧表示） */}
        <div className={`${
          activeTab === 'list' ? 'flex flex-col' : 'hidden'
        } lg:hidden w-full bg-white`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">店舗一覧</h2>
              <p className="text-sm text-gray-600">全{filteredStores.length}件</p>
            </div>
            {/* スマホ版検索窓 */}
            <div className="relative">
              <input
                type="text"
                placeholder="店舗名・住所で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-[#333333]"
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
          </div>
          <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
            <StoreList stores={filteredStores} onStoreClick={handleStoreClick} />
          </div>
        </div>

        {/* PC: 右側地図 / スマホ: タブで切り替え */}
        <div className={`${
          activeTab === 'map' ? 'flex flex-col' : 'hidden'
        } lg:flex lg:flex-col flex-1 relative`}>
          {/* スマホ版検索エリア */}
          <div className="lg:hidden bg-white border-b border-gray-200 overflow-hidden flex flex-col" style={{ height: '50vh' }}>
            <div className="p-4 pb-2">
              <h3 className="text-lg font-bold text-gray-800 mb-3">検索</h3>
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="店舗名・住所で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-base text-[#333333]"
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
              <p className="text-sm text-gray-600 mb-2">
                {filteredStores.length}件の店舗が見つかりました
              </p>
            </div>
            {/* 検索結果の店舗リスト */}
            <div className="flex-1 overflow-y-auto px-4 pb-2">
              {filteredStores.length > 0 ? (
                <div className="space-y-2">
                  {filteredStores.map((store) => (
                    <div
                      key={store.id}
                      onClick={() => handleStoreClick(store)}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                      <h4 className="font-semibold text-gray-800 text-sm">{store.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{store.address}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  該当する店舗が見つかりませんでした
                </p>
              )}
            </div>
          </div>

          {/* 地図エリア */}
          <div className={`flex-1 relative ${activeTab === 'map' ? 'lg:flex-1' : ''}`} style={{ height: activeTab === 'map' ? '50vh' : 'auto' }}>
            <Map stores={filteredStores} selectedStore={selectedStore} />
            
            {/* フィルターパネル */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <h3 className="font-semibold text-gray-800 mb-3">フィルター</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded"
                    checked={filters.hasChair}
                    onChange={() => handleFilterChange('hasChair')}
                  />
                  <span className="text-[#333333]">子ども椅子あり</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded"
                    checked={filters.hasTatamiRoom}
                    onChange={() => handleFilterChange('hasTatamiRoom')}
                  />
                  <span className="text-[#333333]">座敷あり</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded"
                    checked={filters.hasParking}
                    onChange={() => handleFilterChange('hasParking')}
                  />
                  <span className="text-[#333333]">駐車場あり</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded"
                    checked={filters.hasNursingRoom}
                    onChange={() => handleFilterChange('hasNursingRoom')}
                  />
                  <span className="text-[#333333]">授乳室あり</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded"
                    checked={filters.hasDiaperChanging}
                    onChange={() => handleFilterChange('hasDiaperChanging')}
                  />
                  <span className="text-[#333333]">おむつ替え台あり</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
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
        </div>
      </div>
      <Footer />
    </div>
  )
}