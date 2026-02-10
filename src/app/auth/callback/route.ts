import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', options)
        },
      },
    }
  )

  // PKCEフロー（codeがある場合）
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  }

  // メール確認フロー（token_hashがある場合）
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })
    
    if (error) {
      console.error('認証エラー:', error)
      return NextResponse.redirect(new URL('/login?message=メール確認に失敗しました。リンクの有効期限が切れている可能性があります。もう一度お試しください。', requestUrl.origin))
    }
    
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  }

  // どちらもない場合はトップページへ
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}