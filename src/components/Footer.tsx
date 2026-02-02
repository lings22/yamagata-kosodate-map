import Link from 'next/link'

export default function Footer() {
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

      {/* スマホ版フッター（固定解除） */}
      <footer className="md:hidden bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-3 mb-4">
            <Link href="/" className="block text-sm text-gray-600 hover:text-orange-500 transition">
              🗺️ 地図で探す
            </Link>
            <Link href="/stores" className="block text-sm text-gray-600 hover:text-orange-500 transition">
              📋 店舗一覧
            </Link>
            <Link href="/terms" className="block text-sm text-gray-600 hover:text-orange-500 transition">
              📄 利用規約
            </Link>
            <Link href="/privacy" className="block text-sm text-gray-600 hover:text-orange-500 transition">
              🔒 プライバシーポリシー
            </Link>
            <a href="mailto:info@partido.co.jp" className="block text-sm text-gray-600 hover:text-orange-500 transition">
              ✉️ お問い合わせ
            </a>
          </div>
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              運営: <a href="https://partido.co.jp/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">株式会社パルティード</a>
            </p>
            <p className="text-xs text-gray-500">
              © 2026 株式会社パルティード All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}