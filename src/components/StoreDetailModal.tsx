'use client'

import { Store } from '@/hooks/useStores'

interface StoreDetailModalProps {
  store: Store | null
  onClose: () => void
}

export default function StoreDetailModal({ store, onClose }: StoreDetailModalProps) {
  if (!store) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{store.name}</h2>
            <p className="text-sm text-gray-600 mt-1">📍 {store.address}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">設備情報</h3>
            <div className="grid grid-cols-2 gap-3">
              {store.has_nursing_room && (
                <div className="bg-pink-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🍼</span>
                    <span className="font-semibold text-pink-800">授乳室</span>
                  </div>
                  {store.nursing_room_detail && (
                    <p className="text-sm text-gray-600 ml-7">{store.nursing_room_detail}</p>
                  )}
                </div>
              )}
              {store.has_diaper_changing && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">👶</span>
                    <span className="font-semibold text-blue-800">おむつ替え台</span>
                  </div>
                  {store.diaper_changing_detail && (
                    <p className="text-sm text-gray-600 ml-7">{store.diaper_changing_detail}</p>
                  )}
                </div>
              )}
              {store.stroller_accessible && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚼</span>
                    <span className="font-semibold text-purple-800">ベビーカー入店可</span>
                  </div>
                </div>
              )}
              {store.has_parking && (
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🅿️</span>
                    <span className="font-semibold text-orange-800">駐車場</span>
                  </div>
                  {store.parking_detail && (
                    <p className="text-sm text-gray-600 ml-7">{store.parking_detail}</p>
                  )}
                </div>
              )}
              {store.has_private_room && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🚪</span>
                    <span className="font-semibold text-green-800">個室・座敷</span>
                  </div>
                  {store.private_room_detail && (
                    <p className="text-sm text-gray-600 ml-7">{store.private_room_detail}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          {(store.has_chair_0_6m || store.has_chair_6_18m || store.has_chair_18m_3y || store.has_chair_3y_plus) && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">子ども椅子</h3>
              <div className="flex flex-wrap gap-2">
                {store.has_chair_0_6m && (
                  <span className="px-3 py-2 bg-gray-100 text-gray-800 text-sm rounded-full">0-6ヶ月用</span>
                )}
                {store.has_chair_6_18m && (
                  <span className="px-3 py-2 bg-gray-100 text-gray-800 text-sm rounded-full">6-18ヶ月用</span>
                )}
                {store.has_chair_18m_3y && (
                  <span className="px-3 py-2 bg-gray-100 text-gray-800 text-sm rounded-full">18ヶ月-3歳用</span>
                )}
                {store.has_chair_3y_plus && (
                  <span className="px-3 py-2 bg-gray-100 text-gray-800 text-sm rounded-full">3歳以上用</span>
                )}
              </div>
            </div>
          )}
          {store.comment && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">コメント</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{store.comment}</p>
            </div>
          )}
          <div>
            
              <a href={`https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg font-semibold transition"
            >
              Google Mapsで開く
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}