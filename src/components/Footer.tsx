'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useDevice } from '@/contexts/DeviceContext'

export default function Footer() {
  const [showMenu, setShowMenu] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [verifying, setVerifying] = useState(false)
  const { isAdmin, adminLogin, adminLogout } = useDevice()

  const handleAdminLogin = async () => {
    setVerifying(true)
    const success = await adminLogin(adminPassword)
    setVerifying(false)

    if (success) {
      setAdminPassword('')
      setShowAdminModal(false)
      alert('管理者モードになりました')
    } else {
      alert('パスワードが正しくありません')
    }
  }

  const handleAdminLogout = () => {
    adminLogout()
    alert('管理者モードを解除しました')
  }

  const AdminButton = ({ className }: { className?: string }) => {
    if (isAdmin) {
      return (
        <button
          onClick={handleAdminLogout}
          className={className || "text-sm text-red-500 hover:text-red-600 transition"}
        >
          🔓 管理者モード解除
        </button>
      )
    }
    return (
      <button
        onClick={() => setShowAdminModal(true)}
        className={className || "text-sm text-gray-400 hover:text-gray-600 transition"}
      >
        🔒 管理者
      </button>
    )
  }

  return (
    <>
      {/* PC版フッター */}
      <footer className="hidden md:block bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-orange-500 transition">
              地図で探す
            </Link>
            <Link href="/stores" className="text-sm text-gray-600 hover:text-orange-500 transition">
              店舗一覧
            </Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-orange-500 transition">
              山形てくてくマップとは
            </Link>
            <a href="https://forms.gle/B2AHSYHfZsUz8qUX7" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-orange-500 transition">
              📩 情報提供・お問い合わせ
            </a>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-orange-500 transition">
              利用規約
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-orange-500 transition">
              プライバシーポリシー
            </Link>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              運営: <a href="https://partido.co.jp/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">株式会社パルティード</a>
            </p>
            <p className="text-xs text-gray-500 mb-3">
              © 2026 株式会社パルティード All rights reserved.
            </p>
            <AdminButton />
          </div>
        </div>
      </footer>

      {/* スマホ版 ☰ ボタン */}
      <button
        onClick={() => setShowMenu(true)}
        className="md:hidden fixed bottom-6 right-6 bg-orange-400 hover:bg-orange-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40 transition"
      >
        ☰
      </button>

      {/* スマホ版メニュー */}
      {showMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end" onClick={() => setShowMenu(false)}>
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">メニュー</h3>
              <button onClick={() => setShowMenu(false)} className="text-gray-600 text-3xl">×</button>
            </div>
            <div className="space-y-4">
              <Link href="/" onClick={() => setShowMenu(false)} className="block py-3 text-gray-700 hover:text-orange-500 border-b border-gray-200">
                地図で探す
              </Link>
              <Link href="/stores" onClick={() => setShowMenu(false)} className="block py-3 text-gray-700 hover:text-orange-500 border-b border-gray-200">
                店舗一覧
              </Link>
              <Link href="/about" onClick={() => setShowMenu(false)} className="block py-3 text-gray-700 hover:text-orange-500 border-b border-gray-200">
                山形てくてくマップとは
              </Link>
              <a href="https://forms.gle/B2AHSYHfZsUz8qUX7" target="_blank" rel="noopener noreferrer" className="block py-3 text-gray-700 hover:text-orange-500 border-b border-gray-200">
                📩 情報提供・お問い合わせ
              </a>
              <Link href="/terms" onClick={() => setShowMenu(false)} className="block py-3 text-gray-700 hover:text-orange-500 border-b border-gray-200">
                利用規約
              </Link>
              <Link href="/privacy" onClick={() => setShowMenu(false)} className="block py-3 text-gray-700 hover:text-orange-500 border-b border-gray-200">
                プライバシーポリシー
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                運営: <a href="https://partido.co.jp/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">株式会社パルティード</a>
              </p>
              <p className="text-xs text-gray-500 mb-3">© 2026 株式会社パルティード</p>
              <AdminButton />
            </div>
          </div>
        </div>
      )}

      {/* 管理者パスワード入力モーダル */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4" onClick={() => setShowAdminModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">🔒 管理者ログイン</h3>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !verifying && handleAdminLogin()}
              placeholder="パスワードを入力"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 mb-4"
              autoFocus
              disabled={verifying}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowAdminModal(false); setAdminPassword('') }}
                disabled={verifying}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                キャンセル
              </button>
              <button
                onClick={handleAdminLogin}
                disabled={verifying}
                className="flex-1 px-4 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {verifying ? '確認中...' : 'ログイン'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}