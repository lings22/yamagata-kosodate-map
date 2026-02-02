'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [showMenu, setShowMenu] = useState(false)

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
            <Link href="/terms" className="text-sm text-gray-600 hover:text-orange-500 transition">
              利用規約
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-orange-500 transition">
              プライバシーポリシー
            </Link>
            <a href="mailto:info@partido.co.jp" className="text-sm text-gray-600 hover:text-orange-500 transition">
              お問い合わせ
            </a>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              運営: <a href="https://partido.co.jp/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">株式会社パルティード</a>
            </p>
            <p className="text-xs text-gray-500">
              © 2026 株式会社パルティード All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* スマホ用ハンバーガーメニューボタン */}
      <button
        onClick={() => setShowMenu(true)}
        className="md:hidden fixed bottom-6 right-6 bg-orange-400 hover:bg-orange-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40 transition"
        aria-label="メニュー"
      >
        <span className="text-2xl">☰</span>
      </button>

      {/* スマホ用メニューモーダル */}
      {showMenu && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setShowMenu(false)}
        >
          <div 
            className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">メニュー</h3>
              <button
                onClick={() => setShowMenu(false)}
                className="text-gray-600 hover:text-gray-800 text-3xl leading-none"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <Link
                href="/"
                onClick={() => setShowMenu(false)}
                className="block py-3 text-gray-700 hover:text-orange-500 transition border-b border-gray-200"
              >
                🗺️ 地図で探す
              </Link>
              <Link
                href="/stores"
                onClick={() => setShowMenu(false)}
                className="block py-3 text-gray-700 hover:text-orange-500 transition border-b border-gray-200"
              >
                📋 店舗一覧
              </Link>
              <Link
                href="/terms"
                onClick={() => setShowMenu(false)}
                className="block py-3 text-gray-700 hover:text-orange-500 transition border-b border-gray-200"
              >
                📄 利用規約
              </Link>
              <Link
                href="/privacy"
                onClick={() => setShowMenu(false)}
                className="block py-3 text-gray-700 hover:text-orange-500 transition border-b border-gray-200"
              >
                🔒 プライバシーポリシー
              </Link>
              
                href="mailto:info@partido.co.jp"
                className="block py-3 text-gray-700 hover:text-orange-500 transition border-b border-gray-200"
                ✉️ お問い合わせ
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                運営: <a href="https://partido.co.jp/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">株式会社パルティード</a>
              </p>
              <p className="text-xs text-gray-500">
                © 2026 株式会社パルティード All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}