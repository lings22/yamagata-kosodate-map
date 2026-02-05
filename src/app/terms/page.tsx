import Link from 'next/link'

export default function TermsPage() {
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
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                β版
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
            利用規約
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">第1条（適用）</h2>
              <p>
                本規約は、株式会社パルティード（以下「当社」といいます）が提供する山形てくてくマップ（以下「本サービス」といいます）の
                利用に関する条件を定めるものです。ユーザーは、本規約に同意した上で本サービスを利用するものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">第2条（利用登録）</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>本サービスの一部機能（いいね機能等）を利用するには、利用登録が必要です。</li>
                <li>登録希望者は、本規約に同意の上、所定の方法で利用登録を行うものとします。</li>
                <li>当社は、登録希望者が以下のいずれかに該当する場合、登録を拒否することがあります：
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>虚偽の情報を提供した場合</li>
                    <li>過去に本規約違反により登録を抹消された場合</li>
                    <li>その他、当社が不適切と判断した場合</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">第3条（禁止事項）</h2>
              <p className="mb-3">ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>虚偽の情報を掲載する行為</li>
                <li>他のユーザーまたは第三者の知的財産権を侵害する行為</li>
                <li>他のユーザーまたは第三者に不利益、損害を与える行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>不正アクセスまたはこれを試みる行為</li>
                <li>当社または第三者になりすます行為</li>
                <li>営業、宣伝、広告、勧誘等を目的とする行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">第4条（本サービスの提供の停止等）</h2>
              <p className="mb-3">当社は、以下のいずれかの事由があると判断した場合、事前の通知なく本サービスの全部または一部の提供を停止または中断することができるものとします：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>本サービスに係るシステムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により本サービスの提供が困難となった場合</li>
                <li>その他、当社が本サービスの提供が困難と判断した場合</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">第5条（免責事項）</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>当社は、本サービスに掲載される店舗情報の正確性、最新性、有用性等について保証しません。</li>
                <li>本サービスは現状有姿で提供されるものであり、当社は本サービスに関して明示的にも黙示的にも一切保証しません。</li>
                <li>当社は、本サービスの利用によりユーザーに生じた損害について、一切の責任を負いません。</li>
                <li>ユーザーが本サービスを通じて得た情報により損害を被った場合でも、当社は一切の責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">第6条（利用規約の変更）</h2>
              <p>
                当社は、必要と判断した場合、ユーザーに通知することなく本規約を変更することができるものとします。
                変更後の利用規約は、本サービス上に掲載した時点で効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">第7条（準拠法・管轄裁判所）</h2>
              <p>
                本規約の解釈にあたっては、日本法を準拠法とし、本サービスに関して紛争が生じた場合には、
                山形地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
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