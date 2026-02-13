'use client'

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // 毎レンダーで createClient() が評価されないように遅延初期化
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (!supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current

  const checkAdmin = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle()
      
      if (error) {
        console.error('プロフィール取得エラー:', error)
        setIsAdmin(false)
        return
      }
      
      setIsAdmin(data?.is_admin ?? false)
    } catch (err) {
      console.error('checkAdmin エラー:', err)
      setIsAdmin(false)
    }
  }, [supabase])

  useEffect(() => {
    let isMounted = true
    let watchdogId: ReturnType<typeof setTimeout> | null = null

    const finishLoadingSafely = () => {
      if (!isMounted) return
      setLoading(false)
      if (watchdogId) {
        clearTimeout(watchdogId)
        watchdogId = null
      }
    }

    const initializeAuth = async () => {
      try {
        const sessionResult = await Promise.race([
          supabase.auth.getSession(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('getSession timeout')), 8000)
          ),
        ])

        const { data: { session }, error } = sessionResult
        if (error) throw error

        let user = session?.user ?? null

        // getSession で user が取れないケースを保険で補完
        if (!user) {
          const userResult = await Promise.race([
            supabase.auth.getUser(),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('getUser timeout')), 8000)
            ),
          ])
          user = userResult.data.user ?? null
        }

        if (!isMounted) return

        setUser(user)
        finishLoadingSafely()

        if (user) {
          void checkAdmin(user.id)
        } else {
          setIsAdmin(false)
        }
      } catch (err) {
        console.error('セッション取得エラー:', err)
        finishLoadingSafely()
      }
    }

    // どんな異常系でも無限ローディングにしない最後の保険
    watchdogId = setTimeout(() => {
      console.warn('Auth loading watchdog fired')
      finishLoadingSafely()
    }, 10000)

    void initializeAuth()

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return

        const currentUser = session?.user ?? null
        setUser(currentUser)
        finishLoadingSafely()

        if (currentUser) {
          void checkAdmin(currentUser.id)
        } else {
          setIsAdmin(false)
        }
      }
    )

    return () => {
      isMounted = false
      if (watchdogId) clearTimeout(watchdogId)
      subscription.unsubscribe()
    }
  }, [checkAdmin, supabase])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, signUp, signIn, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}