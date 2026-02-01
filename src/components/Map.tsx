'use client'

import { useEffect, useRef, useState } from 'react'
import { Store } from '@/hooks/useStores'

declare global {
  interface Window {
    google: any
  }
}

interface MapProps {
  stores: Store[]
  selectedStore?: Store | null
  center?: { lat: number; lng: number }
  zoom?: number
}

export default function MapComponent({ 
  stores,
  selectedStore,
  center = { lat: 38.2404, lng: 140.3633 },
  zoom = 13 
}: MapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<{ [key: string]: any }>({})
  const infoWindowRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mapInstanceRef.current) return

    const initMap = () => {
      if (!window.google || !window.google.maps) {
        setTimeout(initMap, 100)
        return
      }

      if (!mapRef.current) {
        setTimeout(initMap, 100)
        return
      }

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        })

        infoWindowRef.current = new window.google.maps.InfoWindow()
        mapInstanceRef.current = map

        window.google.maps.event.addListenerOnce(map, 'idle', () => {
          setLoading(false)
        })
      } catch (err: any) {
        console.error('地図初期化エラー:', err)
        setError(`エラー: ${err.message}`)
        setLoading(false)
      }
    }

    setTimeout(initMap, 500)
  }, [center, zoom])

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || loading) {
      return
    }

    Object.values(markersRef.current).forEach(marker => marker.setMap(null))
    markersRef.current = {}

    stores.forEach((store) => {
      const marker = new window.google.maps.Marker({
        position: { lat: store.latitude, lng: store.longitude },
        map: mapInstanceRef.current,
        title: store.name,
        animation: window.google.maps.Animation.DROP,
      })

      marker.addListener('click', () => {
        const contentString = createInfoWindowContent(store)
        infoWindowRef.current.setContent(contentString)
        infoWindowRef.current.open(mapInstanceRef.current, marker)

        setTimeout(() => {
          const detailButton = document.getElementById(`detail-btn-${store.id}`)
          if (detailButton) {
            detailButton.addEventListener('click', () => {
              window.location.href = `/stores/${store.id}`
            })
          }
        }, 100)
      })

      markersRef.current[store.id] = marker
    })
  }, [stores, loading])

  useEffect(() => {
    if (!selectedStore || !mapInstanceRef.current || !window.google) {
      return
    }

    const marker = markersRef.current[selectedStore.id]
    if (!marker) return

    mapInstanceRef.current.panTo({
      lat: selectedStore.latitude,
      lng: selectedStore.longitude
    })
    mapInstanceRef.current.setZoom(16)

    marker.setAnimation(window.google.maps.Animation.BOUNCE)
    setTimeout(() => {
      marker.setAnimation(null)
    }, 2000)

    setTimeout(() => {
      const contentString = createInfoWindowContent(selectedStore)
      infoWindowRef.current.setContent(contentString)
      infoWindowRef.current.open(mapInstanceRef.current, marker)

      setTimeout(() => {
        const detailButton = document.getElementById(`detail-btn-${selectedStore.id}`)
        if (detailButton) {
          detailButton.addEventListener('click', () => {
            window.location.href = `/stores/${selectedStore.id}`
          })
        }
      }, 100)
    }, 500)
  }, [selectedStore])

  const createInfoWindowContent = (store: Store) => {
    const facilities = []
    if (store.has_nursing_room) facilities.push('🍼 授乳室')
    if (store.has_tatami_room) facilities.push('🍵 座敷')
    if (store.has_diaper_changing) facilities.push('👶 おむつ替え')
    if (store.stroller_accessible) facilities.push('🚼 ベビーカーOK')
    if (store.has_parking) facilities.push('🅿️ 駐車場')
    
    const chairs = []
    if (store.has_chair_0_6m) chairs.push('0-6ヶ月')
    if (store.has_chair_6_18m) chairs.push('6-18ヶ月')
    if (store.has_chair_18m_3y) chairs.push('18ヶ月-3歳')
    if (store.has_chair_3y_plus) chairs.push('3歳以上')

    return `
      <div style="max-width: 320px; padding: 12px; font-family: sans-serif;">
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #1f2937;">
          ${store.name}
        </h3>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #6b7280;">
          📍 ${store.address}
        </p>
        
        ${facilities.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <div style="font-size: 14px; font-weight: 600; color: #333333; margin-bottom: 6px;">設備</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${facilities.map(f => `
                <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 12px; font-size: 12px; color: #333333;">
                  ${f}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${chairs.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <div style="font-size: 14px; font-weight: 600; color: #333333; margin-bottom: 6px;">子ども椅子</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${chairs.map(c => `
                <span style="background: #e5e7eb; padding: 4px 8px; border-radius: 12px; font-size: 12px; color: #333333;">
                  ${c}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${store.comment ? `
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
            <div style="font-size: 13px; color: #333333; line-height: 1.5;">
              ${store.comment}
            </div>
          </div>
        ` : ''}

        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <button 
            id="detail-btn-${store.id}"
            style="
              width: 100%;
              background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
              color: white;
              padding: 12px 20px;
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s;
              box-shadow: 0 2px 4px rgba(251, 146, 60, 0.3);
            "
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(251, 146, 60, 0.4)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(251, 146, 60, 0.3)'"
          >
            📋 詳細を見る
          </button>
        </div>
      </div>
    `
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-orange-400 text-white rounded-lg"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
            <p className="mt-4 text-gray-600">地図を読み込んでいます...</p>
          </div>
        </div>
      )}
    </div>
  )
}