'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
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
  
  // SupabaseクライアントをuseRefで管理（モジュールスコープではなく）
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (!supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current

  useEffect(() => {
    let isMounted = true

    // 初回のセッション取得
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (!isMounted) return
        
        if (error) {
          console.error('セッション取得エラー:', error)
          setUser(null)
          setLoading(false)
          return
        }

        const currentUser = session?.user ?? null
        setUser(currentUser)
        setLoading(false)

        // ユーザーがいれば管理者チェック
        if (currentUser) {
          supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', currentUser.id)
            .maybeSingle()
            .then(({ data, error }) => {
              if (!isMounted) return
              
              if (error) {
                console.error('プロフィール取得エラー:', error)
                setIsAdmin(false)
                return
              }
              setIsAdmin(data?.is_admin ?? false)
            })
        } else {
          setIsAdmin(false)
        }
      })
      .catch((err) => {
        console.error('セッション初期化エラー:', err)
        if (isMounted) {
          setUser(null)
          setIsAdmin(false)
          setLoading(false)
        }
      })

    // 認証状態の変更をリアルタイム監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return
        
        const currentUser = session?.user ?? null
        setUser(currentUser)

        // ユーザーがいれば管理者チェック
        if (currentUser) {
          supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', currentUser.id)
            .maybeSingle()
            .then(({ data, error }) => {
              if (!isMounted) return
              
              if (error) {
                console.error('プロフィール取得エラー:', error)
                setIsAdmin(false)
                return
              }
              setIsAdmin(data?.is_admin ?? false)
            })
        } else {
          setIsAdmin(false)
        }
      }
    )

    // クリーンアップ
    return () => {
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