import { NextResponse } from 'next/server';
import { getAllPostsMetadata, PostMetadata } from '@/lib/posts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibecodingchecklist.vercel.app';

function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  const allGuides = getAllPostsMetadata('guides');

  const rssItems = allGuides
    .map((guide: PostMetadata) => {
      const guideUrl = `${SITE_URL}/guides/${guide.slug}`;
      const title = guide.title ? escapeXml(guide.title) : 'Untitled Post';
      const description = guide.description
        ? escapeXml(guide.description)
        : 'A new guide from Vibe Coding Checklist.';
      const pubDate = guide.publishedAt
        ? new Date(guide.publishedAt).toUTCString()
        : new Date().toUTCString();

      return `
        <item>
          <title>${title}</title>
          <link>${guideUrl}</link>
          <guid>${guideUrl}</guid>
          <pubDate>${pubDate}</pubDate>
          <description>${description}</description>
        </item>
      `;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vibe Coding Checklist - Guides</title>
    <link>${SITE_URL}</link>
    <description>Guides, checklists, and brain dumps on AI-assisted development from Vibe Coding Checklist.</description>
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