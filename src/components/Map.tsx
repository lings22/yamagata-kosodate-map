'use client'

import { useEffect, useRef } from 'react'
import { Store } from '@/hooks/useStores'

interface MapProps {
  stores: Store[]
  selectedStore: Store | null
}

export default function Map({ stores, selectedStore }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  // 地図を初期化（一度だけ）
  useEffect(() => {
    if (!mapRef.current || googleMapRef.current) return

    const initMap = () => {
      if (!window.google) {
        setTimeout(initMap, 100)
        return
      }

      googleMapRef.current = new window.google.maps.Map(mapRef.current!, {
        center: { lat: 38.2544, lng: 140.3394 },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      console.log('地図を初期化しました')
    }

    initMap()
  }, [])

  // マーカーを常に再生成（stores が変わるたび）
  useEffect(() => {
    if (!googleMapRef.current) {
      console.log('地図がまだ初期化されていません')
      return
    }

    console.log(`マーカーを生成します: ${stores.length}店舗`)

    // 既存のマーカーをすべて削除
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // マーカーを作成
    stores.forEach((store, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: store.latitude, lng: store.longitude },
        map: googleMapRef.current!,
        title: store.name,
      })

      console.log(`マーカー ${index + 1}: ${store.name}`)

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close()
        }

        const chairs = []
        if (store.has_chair_0_6m) {
          const count = (store as any).chair_count_0_6m
          chairs.push(count > 0 ? `0-6ヶ月: ${count}台` : '0-6ヶ月')
        }
        if (store.has_chair_6_18m) {
          const count = (store as any).chair_count_6_18m
          chairs.push(count > 0 ? `6-18ヶ月: ${count}台` : '6-18ヶ月')
        }
        if (store.has_chair_18m_3y) {
          const count = (store as any).chair_count_18m_3y
          chairs.push(count > 0 ? `18ヶ月-3歳: ${count}台` : '18ヶ月-3歳')
        }
        if (store.has_chair_3y_plus) {
          const count = (store as any).chair_count_3y_plus
          chairs.push(count > 0 ? `3歳以上: ${count}台` : '3歳以上')
        }

        const facilities = []
        if (store.has_nursing_room) facilities.push('🍼 授乳室')
        if (store.has_diaper_changing) facilities.push('👶 おむつ替え')
        if (store.has_tatami_room) facilities.push('🍵 座敷')
        if (store.stroller_accessible) facilities.push('🚼 ベビーカーOK')
        if (store.has_parking) facilities.push('🅿️ 駐車場')

        const allChairsHaveCount = chairs.every(chair => chair.includes('台'))

        const contentString = `
          <div style="padding: 12px; max-width: 280px; font-family: sans-serif;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #333333;">
              ${store.name}
            </h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #666666; line-height: 1.4;">
              ${store.address}
            </p>
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
                ${!allChairsHaveCount ? `
                  <div style="font-size: 11px; color: #6b7280; font-style: italic; margin-top: 6px;">
                    ※台数は未確認です
                  </div>
                ` : ''}
              </div>
            ` : ''}
            ${facilities.length > 0 ? `
              <div style="margin-bottom: 12px;">
                <div style="font-size: 14px; font-weight: 600; color: #333333; margin-bottom: 6px;">設備</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  ${facilities.map(f => `
                    <span style="background: #e5e7eb; padding: 4px 8px; border-radius: 12px; font-size: 12px; color: #333333;">
                      ${f}
                    </span>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            <a href="/stores/${store.id}" style="display: inline-block; margin-top: 8px; padding: 8px 16px; background: #fb923c; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600;">
              詳細を見る
            </a>
          </div>
        `

        const infoWindow = new window.google.maps.InfoWindow({
          content: contentString,
        })

        infoWindow.open(googleMapRef.current!, marker)
        infoWindowRef.current = infoWindow
      })

      markersRef.current.push(marker)
    })

    console.log(`マーカー生成完了: ${markersRef.current.length}個`)
  }, [stores])

  // 選択された店舗にフォーカス
  useEffect(() => {
    if (!googleMapRef.current || !selectedStore) return

    googleMapRef.current.panTo({ lat: selectedStore.latitude, lng: selectedStore.longitude })
    googleMapRef.current.setZoom(16)

    const marker = markersRef.current.find(
      m => m.getTitle() === selectedStore.name
    )
    if (marker) {
      window.google.maps.event.trigger(marker, 'click')
    }
  }, [selectedStore])

  return <div ref={mapRef} className="w-full h-full" />
}