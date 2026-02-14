'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type DeviceContextType = {
  deviceId: string | null
  isReady: boolean
  isAdmin: boolean
  adminLogin: (password: string) => boolean
  adminLogout: () => void
}

const DeviceContext = createContext<DeviceContextType>({
  deviceId: null,
  isReady: false,
  isAdmin: false,
  adminLogin: () => false,
  adminLogout: () => {},
})

const DEVICE_ID_KEY = 'tekuteku_device_id'
const ADMIN_KEY = 'tekuteku_admin'

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // localStorage からデバイスIDを取得、なければ新規生成
    let id = localStorage.getItem(DEVICE_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(DEVICE_ID_KEY, id)
    }
    setDeviceId(id)

    // 管理者モードの復元
    const adminFlag = localStorage.getItem(ADMIN_KEY)
    if (adminFlag === 'true') {
      setIsAdmin(true)
    }

    setIsReady(true)
  }, [])

  const adminLogin = (password: string): boolean => {
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    if (password === correctPassword) {
      setIsAdmin(true)
      localStorage.setItem(ADMIN_KEY, 'true')
      return true
    }
    return false
  }

  const adminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem(ADMIN_KEY)
  }

  return (
    <DeviceContext.Provider value={{ deviceId, isReady, isAdmin, adminLogin, adminLogout }}>
      {children}
    </DeviceContext.Provider>
  )
}

export const useDevice = () => useContext(DeviceContext)