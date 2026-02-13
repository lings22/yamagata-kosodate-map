import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// 認証付きクライアント（書き込み操作・認証用）
// _initialize() でセッション読み込み・トークンリフレッシュが走るため、
// cookieにセッションがある場合は初期化完了まで全クエリがブロックされる。
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 読み取り専用クライアント（認証不要の公開データ取得用）
// セッション管理を一切行わないため、_initialize() のブロックが発生しない。
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
