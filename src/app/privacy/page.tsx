import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                山形てくてくマップ
              </h1>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
            プライバシーポリシー
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. 個人情報の取り扱いについて</h2>
              <p>
                株式会社パルティード（以下「当社」といいます）は、山形てくてくマップ（以下「本サービス」といいます）において、
                ユーザーの個人情報を以下の通り取り扱います。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. 収集する情報</h2>
              <p className="mb-3">本サービスでは、以下の情報を収集します：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>メールアドレス（ログイン時）</li>
                <li>ユーザーID（自動生成）</li>
                <li>いいねした店舗情報</li>
                <li>投稿したコメント・口コミ（今後実装予定）</li>
                <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. 利用目的</h2>
              <p className="mb-3">収集した個人情報は、以下の目的で利用します：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>本サービスの提供・運営</li>
                <li>ユーザー認証</li>
                <li>サービスの改善・開発</li>
                <li>お問い合わせへの対応</li>
                <li>利用規約違反への対応</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. 第三者提供</h2>
              <p>
                当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>ユーザーの同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cookieの使用について</h2>
              <p>
                本サービスでは、ユーザーの利便性向上のためにCookieを使用しています。
                Cookieの使用を希望しない場合は、ブラウザの設定で無効にすることができますが、
                一部機能が利用できなくなる場合があります。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. セキュリティ</h2>
              <p>
                当社は、個人情報の紛失、破壊、改ざん、漏洩等を防止するため、
                適切なセキュリティ対策を実施します。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. プライバシーポリシーの変更</h2>
              <p>
                当社は、必要に応じて本プライバシーポリシーを変更することがあります。
                変更後のプライバシーポリシーは、本ページに掲載した時点で効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. お問い合わせ</h2>
              <p className="mb-3">
                個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください：
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">株式会社パルティード</p>
                <p className="mt-2">Email: <a href="mailto:info@partido.co.jp" className="text-orange-500 hover:underline">info@partido.co.jp</a></p>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">制定日：2026年1月31日</p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}