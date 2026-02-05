'use client'

import Link from 'next/link'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                山形てくてくマップ
              </h1>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/stores"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                📋 一覧
              </Link>
              <Link
                href="/"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 rounded-lg transition"
              >
                🗺️ 地図
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">山形てくてくマップとは</h2>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              「山形てくてくマップ」は、山形市内の子連れで行きやすい飲食店・施設を地図上で検索できる口コミ投稿型のWebサービスです。
            </p>

            <p>
              授乳室・おむつ替え台・子ども用椅子・座敷の有無など、小さな子どもを連れた保護者が外出先で必要とする設備情報を一目で確認できます。
            </p>

            <h3 className="text-xl font-bold text-gray-800 pt-4">🔍 主な機能</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>地図上で子連れにやさしいお店を検索</li>
              <li>授乳室・おむつ替え台・子ども椅子・座敷・駐車場などの設備で絞り込み</li>
              <li>子ども椅子の年齢別台数を掲載（0〜6ヶ月、6〜18ヶ月、18ヶ月〜3歳、3歳以上）</li>
              <li>誰でも口コミを投稿可能（ログイン不要）</li>
              <li>ユーザー登録で店舗情報の追加・いいね機能が利用可能</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 pt-4">💡 サービス名の由来</h3>
            <p>
              「てくてく」は、小さな子どもが歩く様子を表す擬態語です。子育て中の親子が「てくてく」と気軽にお出かけできるように、という想いが込められています。
            </p>

            <h3 className="text-xl font-bold text-gray-800 pt-4">📝 情報の提供について</h3>
            <p>
              掲載されている情報は、管理者やユーザーの皆さまからの投稿に基づいています。情報の誤りや最新情報をお持ちの方は、各店舗の詳細ページからご報告ください。
            </p>

            <h3 className="text-xl font-bold text-gray-800 pt-4">🏢 運営</h3>
            <p>株式会社パルティード</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}