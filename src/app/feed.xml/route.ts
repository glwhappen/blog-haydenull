import RSS from 'rss'

import { getBlogFrontMatterList } from '@/lib/blog'
import { SEO } from '@/lib/constants'
import { getWeeklyFrontMatterList } from '@/lib/weekly'

export async function GET() {
  const feed = new RSS({
    title: SEO.title,
    description: SEO.description,
    site_url: SEO.url.href,
    feed_url: `${SEO.url.href}feed.xml`,
    language: 'zh-CN',
    image_url: `${SEO.url.href}/assets/avatar.png`,
    generator: 'PHP 9.0',
  })

  const blogs = getBlogFrontMatterList()?.map((item) => ({ ...item, type: 'blog' }))
  const weeklies = getWeeklyFrontMatterList()?.map((item) => ({ ...item, type: 'weekly' }))
  const articles = [...blogs, ...weeklies]?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  articles.forEach(
    ({ title, type, slug, description = SEO.title, cover = `${SEO.url.href}/assets/avatar.png`, date }) => {
      feed.item({
        title,
        guid: `${type}-${slug}`,
        url: `${SEO.url.href}/${type}/${slug}`,
        description,
        date: new Date(date),
        enclosure: {
          url: cover,
        },
      })
    },
  )

  return new Response(feed.xml(), {
    headers: {
      'content-type': 'application/xml',
    },
  })
}
