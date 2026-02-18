import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DeviceProvider } from '@/contexts/DeviceContext'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  title: "山形てくてくマップ | 授乳室・おむつ替え台・子ども椅子情報",
  description: "山形市の授乳室・おむつ替え台・子ども椅子のある施設を簡単に検索できるマップサービス。子育て中のママパパを応援します。",
  keywords: ["山形", "子育て", "授乳室", "おむつ替え", "子ども椅子", "ベビーカー", "マップ", "てくてく"],
  authors: [{ name: "株式会社パルティード", url: "https://partido.co.jp/" }],
  creator: "株式会社パルティード",
  publisher: "株式会社パルティード",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://yamagata-tekuteku-map.jp/",
    title: "山形てくてくマップ",
    description: "山形市の授乳室・おむつ替え台・子ども椅子情報を検索",
    siteName: "山形てくてくマップ",
  },
  twitter: {
    card: "summary_large_image",
    title: "山形てくてくマップ",
    description: "山形市の授乳室・おむつ替え台・子ども椅子情報を検索",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <GoogleAnalytics />
        <DeviceProvider>
          {children}
        </DeviceProvider>
      </body>
    </html>
  );
}