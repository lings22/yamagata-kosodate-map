'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type DeviceContextType = {
  deviceId: string | null
  isReady: boolean
}

const DeviceContext = createContext<DeviceContextType>({
  deviceId: null,
  isReady: false,
})

const DEVICE_ID_KEY = 'tekuteku_device_id'

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // localStorage からデバイスIDを取得、なければ新規生成
    let id = localStorage.getItem(DEVICE_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(DEVICE_ID_KEY, id)
    }
    setDeviceId(id)
    setIsReady(true)
  }, [])

  return (
    <DeviceContext.Provider value={{ deviceId, isReady }}>
      {children}
    </DeviceContext.Provider>
  )
}

export const useDevice = () => useContext(DeviceContext)