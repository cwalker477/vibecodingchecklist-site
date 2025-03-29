import { NextResponse } from 'next/server';
import { getAllPostsMetadata } from '@/lib/posts'; // Use @/ alias

// IMPORTANT: Replace with your actual production domain
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibecodingchecklist.vercel.app'; // Updated fallback

export async function GET() {
  // Fetch all guide metadata
  const allGuides = getAllPostsMetadata('guides');

  // Generate sitemap entries for guides
  const guideUrls = allGuides.map((guide) => {
    // Use publishedAt for lastmod, fallback to current date if missing (shouldn't happen with validation)
    const lastMod = guide.publishedAt ? new Date(guide.publishedAt).toISOString() : new Date().toISOString();
    return `
    <url>
      <loc>${SITE_URL}/guides/${guide.slug}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>weekly</changefreq> 
      <priority>0.8</priority> 
    </url>
    `;
    // Note: changefreq and priority are hints for crawlers
  }).join('');

  // Add other static pages if needed
  const staticUrls = `
    <url>
      <loc>${SITE_URL}/</loc>
      <lastmod>${new Date().toISOString()}</lastmod> 
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${SITE_URL}/guides</loc> 
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
    `;
    // Add more static pages like /about, /faq etc. here if they exist

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${guideUrls}
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
