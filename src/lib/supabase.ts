import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// ========================================
// 単一クライアント（シングルトン）
// ========================================
// @supabase/ssr の createBrowserClient は Cookie にセッションを保存し、
// Next.js 16 の RSC ハイドレーションを妨害するため使用しない。
// 通常の @supabase/supabase-js を使用（localStorage ベース）。
// <any> を指定してデータベース型の推論を回避（never 型エラー防止）。

let client: ReturnType<typeof createSupabaseClient<any>> | null = null

export function createClient() {
  if (client) return client

  client = createSupabaseClient<any>(
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
  return client
}

// 後方互換性のため（useStores.ts などで使用）
export const createPublicClient = createClient