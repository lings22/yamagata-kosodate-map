import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/stores/*/edit',  // 編集ページ（検索結果に不要）
        ],
      },
    ],
    sitemap: 'https://yamagata-tekuteku-map.jp/sitemap.xml',
  }
}