import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const correctPassword = process.env.ADMIN_PASSWORD

    if (!correctPassword) {
      return NextResponse.json({ success: false, message: '管理者パスワードが設定されていません' }, { status: 500 })
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: 'パスワードが正しくありません' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ success: false, message: 'エラーが発生しました' }, { status: 500 })
  }
}