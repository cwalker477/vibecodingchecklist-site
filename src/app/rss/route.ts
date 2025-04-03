import { NextResponse } from 'next/server';
// Import from Supabase libraries
import { getAllPublishedBlogPostsMetadata, BlogPostMetadata } from '@/lib/blog';
import { getAllPublishedGuidesMetadata, GuideMetadata } from '@/lib/guides';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibecodingchecklist.vercel.app';

// Correct escapeXml function
function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '<';
      case '>': return '>';
      case '&': return '&';
      case "'": return '&#39;'; // Use character code for single quote
      case '"': return '"';
      default: return c;
    }
  });
}

// Define a common structure for combined items
interface FeedItem {
  type: 'blog' | 'guide';
  slug: string;
  title: string;
  excerpt?: string;
  published_at?: string; // Keep as string for sorting
}

export async function GET() {
  // Fetch both blog posts and guides
  const [blogPosts, guides] = await Promise.all([
    getAllPublishedBlogPostsMetadata(),
    getAllPublishedGuidesMetadata()
  ]);

  // Map to common structure and add type identifier
  const combinedItems: FeedItem[] = [
    ...blogPosts.map((post): FeedItem => ({
      type: 'blog',
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      published_at: post.published_at,
    })),
    ...guides.map((guide): FeedItem => ({
      type: 'guide',
      slug: guide.slug,
      title: guide.title,
      excerpt: guide.excerpt,
      published_at: guide.published_at,
    })),
  ];

  // Sort combined items by published_at date (newest first)
  combinedItems.sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return dateB - dateA; // Descending order
  });


  const rssItems = combinedItems
    .map((item: FeedItem) => {
      const itemUrl = `${SITE_URL}/${item.type === 'blog' ? 'blog' : 'guides'}/${item.slug}`;
      // Ensure title and description are escaped
      const title = item.title ? escapeXml(item.title) : 'Untitled Post';
      // Use excerpt if available, otherwise a default description
      const description = item.excerpt ? escapeXml(item.excerpt) : `A new ${item.type} from Vibe Coding Checklist.`;
      const pubDate = item.published_at ? new Date(item.published_at).toUTCString() : new Date().toUTCString();

      return `
        <item>
          <title>${title}</title>
          <link>${itemUrl}</link>
          <guid>${itemUrl}</guid>
          <pubDate>${pubDate}</pubDate>
          <description>${description}</description>
        </item>
      `;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vibe Coding Checklist - Blog & Guides</title> {/* Updated title */}
    <link>${SITE_URL}</link>
    <description>Latest blog posts and guides on AI-assisted development from Vibe Coding Checklist.</description> {/* Updated description */}
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}

export const dynamic = 'force-dynamic';
