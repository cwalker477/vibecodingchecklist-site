import Link from 'next/link';
import { getAllPublishedBlogPostsMetadata, BlogPostMetadata } from '@/lib/blog';
import PostCard from '@/components/PostCard'; // Use default import

export const metadata = {
  title: 'Blog | VibeCodingChecklist',
  description: 'Latest articles and insights on vibe coding.',
};

// Revalidate data periodically (e.g., every hour) or on-demand
// See Next.js docs for ISR options if needed: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating
export const revalidate = 3600; // Revalidate every hour

export default async function BlogIndexPage() {
  let posts: BlogPostMetadata[] = [];
  try {
    posts = await getAllPublishedBlogPostsMetadata();
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    // Optionally render an error state
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-center text-neutral-500 dark:text-neutral-400">
          No blog posts published yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              title={post.title}
              description={post.excerpt || ''} // Provide empty string if excerpt is null/undefined
              href={`/blog/${post.slug}`}
              publishedAt={post.published_at} // Use publishedAt prop
            />
          ))}
        </div>
      )}
    </div>
  );
}
