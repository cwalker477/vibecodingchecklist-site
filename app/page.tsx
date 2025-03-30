import React from 'react';
import Link from 'next/link';
import { getAllPostsMetadata, PostMetadata } from '@/lib/posts'; 
import PostCard from '@/components/PostCard'; 

export default function HomePage() { 
  const posts = getAllPostsMetadata('guides');
  // Get latest 3 for featured section
  const featuredPosts = posts.slice(0, 3); 

  return (
    // Use Inter font (applied via layout), set base dark mode text color
    <main className="max-w-5xl mx-auto px-6 py-16 md:py-24 font-sans text-neutral-800 dark:text-dark-text"> 
      <section className="mb-16 md:mb-20 text-center">
        {/* Use dark heading color */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4 text-neutral-900 dark:text-dark-heading"> 
          Vibe Coding Checklist
        </h1>
        {/* Use lighter dark text color */}
        <p className="text-lg md:text-xl text-neutral-600 dark:text-dark-muted max-w-2xl mx-auto"> 
          Curated guides and insights for AI-powered developers.
        </p>
      </section>

      {featuredPosts.length > 0 && ( // Only show section if posts exist
        <section className="mb-16 md:mb-20">
           <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8 text-center text-neutral-900 dark:text-dark-heading">Featured Guides</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post: PostMetadata) => ( 
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                description={post.description}
                publishedAt={post.publishedAt}
                tags={post.tags}
              />
            ))}
          </div>
        </section>
      )}

      {/* Keep this section even if no posts, points to index */}
      <div className="mt-16 text-center">
        <Link href="/guides" legacyBehavior={false}> 
          {/* Use accent color */}
          <span className="cursor-pointer inline-block text-dark-accent hover:underline transition font-medium"> 
            View All Guides →
          </span>
        </Link>
      </div>
    </main>
  );
}
