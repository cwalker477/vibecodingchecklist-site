import { NextResponse } from 'next/server';
import { getAllPostsMetadata } from '@/lib/posts'; // Assuming '@/' alias for src/

// Use the actual Vercel domain as fallback
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibecodingchecklist.vercel.app';

// Function to escape XML characters
function escapeXml(str: string): string {
  // Correctly escapes characters for XML validity
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '<';
      case '>': return '>';
      case '&': return '&';
      case "'": return ''';
      case '"': return '"';
      default: return c;
    }
  });
}

export async function GET() {
  const allGuides = getAllPostsMetadata('guides'); // Fetch all guide metadata

  const rssItems = allGuides
    .map((guide) => {
      // Construct the absolute URL for the guide
      const guideUrl = `${SITE_URL}/guides/${guide.slug}`;

      // Ensure required fields exist and format pubDate
      const title = guide.title ? escapeXml(guide.title) : 'Untitled Post';
      // Use description or provide a default
      const description = guide.description ? escapeXml(guide.description) : 'A new guide from Vibe Coding Checklist.';
      const pubDate = guide.publishedAt ? new Date(guide.publishedAt).toUTCString() : new Date().toUTCString();

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
      // Optional: Add caching headers if desired
      // 'Cache-Control': 's-maxage=600, stale-while-revalidate=30', // Cache for 10 mins
    },
  });
}

// Enforce dynamic rendering to ensure the feed is up-to-date
export const dynamic = 'force-dynamic';
