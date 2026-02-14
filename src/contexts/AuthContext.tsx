'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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

  // シングルトンなので useRef 不要
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true

    console.log('[AUTH] useEffect開始', Date.now())

    // --- 管理者チェック ---
    const checkAdmin = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userId)
          .maybeSingle()

        if (!isMounted) return
        if (error) {
          console.error('[AUTH] プロフィール取得エラー:', error)
          setIsAdmin(false)
          return
        }
        setIsAdmin(data?.is_admin ?? false)
        console.log('[AUTH] checkAdmin完了:', data?.is_admin)
      } catch (err) {
        console.error('[AUTH] checkAdmin失敗:', err)
        if (isMounted) setIsAdmin(false)
      }
    }

    // --- 初期セッション取得（5秒タイムアウト付き） ---
    const init = async () => {
      console.log('[AUTH] getUser開始', Date.now())

      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AUTH_TIMEOUT: getUser() 5秒タイムアウト')), 5000)
        )

        const { data: { user: currentUser }, error } = await Promise.race([
          supabase.auth.getUser(),
          timeoutPromise,
        ]) as Awaited<ReturnType<typeof supabase.auth.getUser>>

        console.log('[AUTH] getUser完了', {
          hasUser: !!currentUser,
          error: error?.message,
          timestamp: Date.now(),
        })

        if (!isMounted) return

        if (error) {
          console.warn('[AUTH] getUser error:', error.message)
          setUser(null)
          setIsAdmin(false)
        } else if (currentUser) {
          setUser(currentUser)
          await checkAdmin(currentUser.id)
        } else {
          setUser(null)
          setIsAdmin(false)
        }
      } catch (err) {
        // タイムアウトまたはネットワークエラー
        console.error('[AUTH] init失敗（タイムアウトの可能性）:', err)
        if (!isMounted) return
        setUser(null)
        setIsAdmin(false)
      } finally {
        if (isMounted) {
          console.log('[AUTH] setLoading(false)', Date.now())
          setLoading(false)
        }
      }
    }

    init()

    // --- 認証状態変化リスナー ---
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      console.log('[AUTH] onAuthStateChange', { event, hasSession: !!session, timestamp: Date.now() })

      if (!isMounted) return

      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        await checkAdmin(currentUser.id)
      } else {
        setIsAdmin(false)
      }

      // リスナー経由でも loading を確実に解除
      setLoading(false)
    })

    return () => {
      console.log('[AUTH] cleanup')
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

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