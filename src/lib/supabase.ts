import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// 認証付きクライアント（書き込み操作・認証用）
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // navigator.locks デッドロック防止:
        // ログイン中にリロードすると、前ページが保持していた navigator.locks が
        // 解放される前に新ページがロック取得を試み、永遠にハングする。
        // ロックを無効化して _initialize() を直接実行することで問題を回避する。
        lock: async <R>(
          _name: string,
          _acquireTimeout: number,
          fn: () => Promise<R>
        ): Promise<R> => {
          return await fn()
        },
      },
    }
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
