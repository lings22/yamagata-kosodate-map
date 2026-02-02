'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

type Tab = 'login' | 'register'

// useSearchParamsを使うコンポーネントを分離
function LoginForm() {
  const [activeTab, setActiveTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlMessage = searchParams.get('message')
  const { signIn, signUp } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/')
    } catch (err: any) {
      if (err.message?.includes('Email not confirmed')) {
        setError('メールアドレスが確認されていません。確認メール内のリンクをクリックしてください。')
      } else {
        setError(err.message || 'ログインに失敗しました')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password)
      setMessage('確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.message || '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setError(null)
    setMessage(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            山形子育てマップ
          </h1>
          <p className="text-gray-600">
            授乳室・おむつ替え台・子ども椅子のある<br />
            お店を簡単に検索
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* URLからのメッセージ表示 */}
          {urlMessage && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
              ✅ {urlMessage}
            </div>
          )}

          {/* タブ */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                activeTab === 'login'
                  ? 'bg-white text-orange-500 shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ログイン
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                activeTab === 'register'
                  ? 'bg-white text-orange-500 shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              新規登録
            </button>
          </div>

          {/* ログインフォーム */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-[#333333]"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-[#333333]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>
          )}

          {/* 新規登録フォーム */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <p className="font-semibold mb-1">✅ {message}</p>
                  <p className="text-sm">メールが届かない場合は、迷惑メールフォルダをご確認ください。</p>
                </div>
              )}

              {!message && (
                <>
                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                      メールアドレス
                    </label>
                    <input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-[#333333]"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                      パスワード（6文字以上）
                    </label>
                    <input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-[#333333]"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                      パスワード（確認）
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-[#333333]"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '登録中...' : '新規登録'}
                  </button>
                </>
              )}
            </form>
          )}

          {/* 地図を見るリンク */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-orange-500 hover:underline">
              🗺️ 地図を見る（ログイン不要）
            </Link>
          </div>

          {/* 規約リンク */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>
              登録することで
              <Link href="/terms" className="text-orange-500 hover:underline mx-1">
                利用規約
              </Link>
              と
              <Link href="/privacy" className="text-orange-500 hover:underline mx-1">
                プライバシーポリシー
              </Link>
              に同意したものとみなされます
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// メインのエクスポート（Suspenseでラップ）
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}