'use client'

import { Store } from '@/hooks/useStores'
import { useLikes } from '@/hooks/useLikes'

interface StoreListProps {
  stores?: Store[]
  onStoreClick?: (store: Store) => void
}

function LikeButton({ storeId, initialLikesCount }: { storeId: string; initialLikesCount: number }) {
  const { isLiked, likesCount, loading, toggleLike } = useLikes(storeId)
  const displayCount = likesCount || initialLikesCount

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleLike()
      }}
      disabled={loading}
      className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
    >
      <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
      <span className="text-sm font-semibold text-gray-700">{displayCount}</span>
    </button>
  )
}

export default function StoreList({ stores = [], onStoreClick }: StoreListProps) {
  if (stores.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>該当する店舗が見つかりませんでした</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
      {stores.map((store) => (
        <div 
          key={store.id}
          onClick={() => onStoreClick?.(store)}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg text-gray-800 flex-1">
              {store.name}
            </h3>
            <LikeButton storeId={store.id} initialLikesCount={store.likes_count} />
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            📍 {store.address}
          </p>

          <div className="flex flex-wrap gap-2">
            {store.has_nursing_room && (
              <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                🍼 授乳室
              </span>
            )}
            {store.has_tatami_room && (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                🍵 座敷
              </span>
            )}
            {store.has_diaper_changing && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                👶 おむつ替え
              </span>
            )}
            {(store.has_chair_0_6m || store.has_chair_6_18m || store.has_chair_18m_3y || store.has_chair_3y_plus) && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full" title="※台数は未確認です。情報お待ちしております">
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

          {store.comment && (
            <p className="mt-3 text-sm text-gray-600 border-t pt-2">
              {store.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}