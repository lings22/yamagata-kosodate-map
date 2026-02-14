import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = body?.password
    const correctPassword = process.env.ADMIN_PASSWORD

    // デバッグ用ログ（Vercel Runtime Logsで確認可能）
    console.log('[admin-verify] 環境変数ADMIN_PASSWORD存在:', !!correctPassword)
    console.log('[admin-verify] 入力パスワード存在:', !!password)

    if (!correctPassword) {
      console.error('[admin-verify] ADMIN_PASSWORD環境変数が未設定です')
      return NextResponse.json(
        { success: false, message: '管理者パスワードが設定されていません' },
        { status: 500 }
      )
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, message: 'パスワードが正しくありません' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('[admin-verify] エラー:', error)
    return NextResponse.json(
      { success: false, message: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}