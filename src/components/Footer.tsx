import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* コンパクトなリンク集 */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
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
          <a 
            href="mailto:info@partido.co.jp" 
            className="text-sm text-gray-600 hover:text-orange-500 transition"
          >
            お問い合わせ
          </a>
        </div>

        {/* 運営者情報とコピーライト */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            運営：
            <a 
              href="https://partido.co.jp/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline ml-1"
            >
              株式会社パルティード
            </a>
          </p>
          <p className="text-sm text-gray-600">
            © 2026 株式会社パルティード All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}