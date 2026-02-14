import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// ========================================
// 認証付きクライアント（シングルトン）
// ========================================
// 重要: 毎回 new すると Multiple GoTrueClient instances 警告が出て
// onAuthStateChange の競合 → 本番環境でのハングの原因になる
let authClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (authClient) return authClient

  console.log('[SUPABASE] Creating auth client (singleton)')
  authClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return authClient
}

// ========================================
// 読み取り専用クライアント（認証不要の公開データ取得用）
// ========================================
let publicClient: ReturnType<typeof createSupabaseClient> | null = null

export function createPublicClient() {
  if (!publicClient) {
    publicClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    )
  }
  return publicClient
}