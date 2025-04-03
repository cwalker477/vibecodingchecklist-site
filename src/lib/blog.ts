import { supabase } from './supabaseClient';

// Define the structure of the blog post data we expect from Supabase
// Based on the columns discussed in the plan.
export interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  content: string; // Markdown/MDX content
  excerpt?: string;
  status: 'draft' | 'published';
  template: string; // e.g., 'standard-blog-layout'
  published_at?: string;
  metadata?: Record<string, any>; // For tags, SEO, etc.
}

export interface BlogPostMetadata {
  title: string;
  slug: string;
  excerpt?: string;
  published_at?: string;
  template: string;
}

/**
 * Fetches metadata for all published blog posts.
 * Ordered by published_at date descending.
 */
export async function getAllPublishedBlogPostsMetadata(): Promise<BlogPostMetadata[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('title, slug, excerpt, published_at, template')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published blog posts metadata:', error);
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  // Ensure published_at is handled correctly (it might be null)
  return data || [];
}

/**
 * Fetches a single blog post by its slug.
 * Only retrieves published posts unless explicitly allowed otherwise.
 * @param slug The slug of the blog post to fetch.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*') // Select all columns for the single post view
    .eq('slug', slug)
    .eq('status', 'published') // Ensure only published posts are fetched by slug publicly
    .maybeSingle(); // Returns null if no matching post is found

  if (error) {
    console.error(`Error fetching blog post by slug "${slug}":`, error);
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  return data;
}

// Potential future functions:
// - getDraftBlogPostBySlug (for previews)
// - getAllBlogPosts (for an admin dashboard)
