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
  
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (!supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current

  useEffect(() => {
    let isMounted = true

    // getUser()を使う（getSession()より確実）
    supabase.auth.getUser()
      .then(({ data: { user }, error }) => {
        if (!isMounted) return
        
        if (error) {
          console.error('ユーザー取得エラー:', error)
          setUser(null)
          setIsAdmin(false)
          setLoading(false)
          return
        }

        setUser(user)
        setLoading(false)

        if (user) {
          supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
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
        console.error('認証初期化エラー:', err)
        if (isMounted) {
          setUser(null)
          setIsAdmin(false)
          setLoading(false)
        }
      })

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return
        
        const currentUser = session?.user ?? null
        setUser(currentUser)

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