import { supabase } from './supabaseClient';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// Define the structure of the guide data we expect from Supabase
// Based on the columns discussed in the plan.
export interface Guide {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string; // Markdown/MDX content
  excerpt?: string;
  status: 'draft' | 'published';
  template: string; // e.g., 'standard-guide-layout'
  published_at?: string;
  difficulty?: string;
  tags?: string[];
  related_tools?: string[];
  prerequisites?: string;
  author_name?: string;
  featured_image_url?: string;
  reading_time_minutes?: number;
  metadata?: Record<string, any>; // For SEO, etc.
}

// Define structure for metadata list (used on index pages)
export interface GuideMetadata {
  title: string;
  slug: string;
  excerpt?: string;
  published_at?: string;
  template: string;
  difficulty?: string;
  tags?: string[];
  featured_image_url?: string;
  reading_time_minutes?: number;
}

/**
 * Fetches metadata for all published guides.
 * Ordered by published_at date descending.
 */
export async function getAllPublishedGuidesMetadata(): Promise<GuideMetadata[]> {
  const { data, error } = await supabase
    .from('guides')
    .select('title, slug, excerpt, published_at, template, difficulty, tags, featured_image_url, reading_time_minutes')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published guides metadata:', error);
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetches a single published guide by its slug and serializes its MDX content.
 * @param slug The slug of the guide to fetch.
 */
export async function getGuideBySlug(slug: string): Promise<(Guide & { mdxSource: MDXRemoteSerializeResult }) | null> {
  const { data: guideData, error } = await supabase
    .from('guides')
    .select('*') // Select all columns for the single guide view
    .eq('slug', slug)
    .eq('status', 'published') // Ensure only published guides are fetched by slug publicly
    .maybeSingle(); // Returns null if no matching guide is found

  if (error) {
    console.error(`Error fetching guide by slug "${slug}":`, error);
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  if (!guideData) {
    return null; // Guide not found or not published
  }

  // Serialize the MDX content from the 'content' field
  let mdxSource: MDXRemoteSerializeResult;
  try {
    mdxSource = await serialize(guideData.content || '', { // Use empty string if content is null
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, {
            behavior: 'append',
            properties: { className: ['anchor-link'], ariaHidden: true, tabIndex: -1 },
            content: { type: 'text', value: '#' }
          }],
        ],
        format: 'mdx',
      },
      // Pass metadata to the MDX component if needed via scope
      // scope: guideData, // Be careful about exposing too much data
    });
  } catch (serializeError) {
    console.error(`Error serializing MDX for guide slug "${slug}":`, serializeError);
    // Decide how to handle serialization errors - throw or return null/partial data?
    // For now, let's throw to make the error visible.
    throw new Error(`Failed to serialize MDX content: ${serializeError instanceof Error ? serializeError.message : String(serializeError)}`);
  }


  // Combine the guide data with the serialized MDX source
  return {
    ...guideData,
    mdxSource,
  };
}
