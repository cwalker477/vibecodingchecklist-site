import { NextResponse } from 'next/server';
// Import from Supabase libraries
import { getAllPublishedBlogPostsMetadata } from '@/lib/blog';
import { getAllPublishedGuidesMetadata } from '@/lib/guides';

// IMPORTANT: Replace with your actual production domain
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibecodingchecklist.vercel.app'; // Updated fallback

// Helper function to generate a sitemap URL entry
function generateUrlEntry(loc: string, lastmod?: string, changefreq: string = 'weekly', priority: number = 0.8): string {
  const lastmodEntry = lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '';
  return `
  <url>
    <loc>${loc}</loc>
    ${lastmodEntry}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

export async function GET() {
  // Fetch metadata for both blog posts and guides
  const [blogPosts, guides] = await Promise.all([
    getAllPublishedBlogPostsMetadata(),
    getAllPublishedGuidesMetadata()
  ]);

  // Generate sitemap entries for blog posts
  const blogUrls = blogPosts.map(post =>
    generateUrlEntry(`${SITE_URL}/blog/${post.slug}`, post.published_at)
  ).join('');

  // Generate sitemap entries for guides
  const guideUrls = guides.map(guide =>
    generateUrlEntry(`${SITE_URL}/guides/${guide.slug}`, guide.published_at)
  ).join('');

  // Generate entries for static pages
  const staticUrls = [
    generateUrlEntry(`${SITE_URL}/`, undefined, 'weekly', 1.0),
    generateUrlEntry(`${SITE_URL}/guides`, undefined, 'weekly', 0.9),
    generateUrlEntry(`${SITE_URL}/blog`, undefined, 'weekly', 0.9),
    // Add more static pages like /about, /faq etc. here if they exist
  ].join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${guideUrls}
  ${blogUrls}
</urlset>`;

  return new NextResponse(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Optional: Add caching headers
      // 'Cache-Control': 's-maxage=3600, stale-while-revalidate=60', // Cache for 1 hour
    },
  });
}

// Enforce dynamic rendering to ensure the sitemap includes the latest posts
export const dynamic = 'force-dynamic';
