import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yamagata-tekuteku-map.jp'
  
  // Supabaseから店舗データを取得
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: stores } = await supabase
    .from('stores')
    .select('id, created_at')
    .order('created_at', { ascending: false })
  
  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
  
  // 動的ページ（各店舗の詳細ページ）
  const storePages: MetadataRoute.Sitemap = stores?.map((store) => ({
    url: `${baseUrl}/stores/${store.id}`,
    lastModified: new Date(store.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []
  
  return [...staticPages, ...storePages]
}