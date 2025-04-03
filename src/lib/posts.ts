// This file previously contained functions for reading and processing
// local Markdown (.mdx) files from the /content directory for guides and potentially other content types.
//
// As of [Date of Change - e.g., April 3, 2025], the Blog Posts and Guides content
// has been migrated to Supabase. Data fetching for these types is now handled by:
// - src/lib/blog.ts
// - src/lib/guides.ts
//
// This file is kept temporarily for reference but its functions are no longer
// actively used by the blog or guide sections of the site.
// It may be removed completely in the future if no other content types rely on it.

// Example of potentially reusable type (consider moving to a central types file if needed elsewhere):
/*
export interface PostMetadata {
  slug: string;
  title: string;
  publishedAt: string; // ISO 8601 date string
  description?: string;
  tags?: string[];
  format?: string;
  readingTime?: number;
  [key: string]: any;
}
*/
