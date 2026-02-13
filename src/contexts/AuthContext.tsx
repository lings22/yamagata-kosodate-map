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
  
  // useRefで一度だけクライアントを作成
  const supabaseRef = useRef(createClient())
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

    // セーフティタイムアウト:
    // createBrowserClient の _initialize()（トークンリフレッシュ等）が
    // ハングした場合でも、loading を確実に解除する。
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false)
      }
    }, 3000)

    // onAuthStateChange が INITIAL_SESSION を即座に発火し、
    // その後の TOKEN_REFRESHED / SIGNED_IN / SIGNED_OUT も監視する。
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        clearTimeout(safetyTimer)
        if (!isMounted) return

        const currentUser = session?.user ?? null
        setUser(currentUser)
        setLoading(false)

        if (currentUser) {
          void checkAdmin(currentUser.id)
        } else {
          setIsAdmin(false)
        }
      }
    )

    return () => {
      isMounted = false
      clearTimeout(safetyTimer)
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