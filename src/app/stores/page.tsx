'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStores, Store } from '@/hooks/useStores'
import StoreList from '@/components/StoreList'
import Footer from '@/components/Footer'

export default function StoresPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { stores } = useStores()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

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
    router.push(`/stores/${store.id}`)
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                山形てくてくマップ
              </h1>
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
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  ログアウト
                </button>
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

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* 検索バー */}
        <div className="mb-6">
          <div className="relative">
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
          <p className="text-sm text-gray-600 mt-2">
            {filteredStores.length}件の店舗が見つかりました
          </p>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">フィルター</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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

        {/* 店舗一覧 */}
        <div className="bg-white rounded-lg shadow-sm">
          <StoreList stores={filteredStores} onStoreClick={handleStoreClick} />
        </div>
      </div>
      
      <Footer />
    </div>
  )
}