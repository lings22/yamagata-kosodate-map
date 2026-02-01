import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404イラスト */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-orange-400 opacity-20">404</div>
          <div className="text-6xl -mt-16">🗺️</div>
        </div>

        {/* メッセージ */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ページが見つかりません
        </h1>
        <p className="text-gray-600 mb-8">
          お探しのページは存在しないか、<br />
          移動または削除された可能性があります。
        </p>

        {/* ボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition shadow-lg"
          >
            🏠 トップページに戻る
          </Link>
          <Link
            href="/stores"
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition shadow-lg border border-gray-200"
          >
            📋 店舗一覧を見る
          </Link>
        </div>

        {/* 追加情報 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            お困りの場合は
            <a 
              href="mailto:info@partido.co.jp" 
              className="text-orange-500 hover:underline ml-1"
            >
              お問い合わせ
            </a>
            ください
          </p>
        </div>
      </div>
    </div>
  )
}