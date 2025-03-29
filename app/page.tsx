import React from 'react';
import Link from 'next/link';
// Corrected imports using @/ alias
import { getAllPostsMetadata, PostMetadata } from '@/lib/posts'; 
import PostCard from '@/components/PostCard'; 

export default function HomePage() { // Removed async as getAllPostsMetadata is sync
  const posts = getAllPostsMetadata('guides');

  return (
    // Added dark mode text color for base text
    <main className="max-w-5xl mx-auto px-6 py-16 font-sans text-neutral-800 dark:text-neutral-200"> 
      <section className="mb-12 text-center">
        {/* Added dark mode text color */}
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 dark:text-neutral-100"> 
          Vibe Coding Checklist
        </h1>
        {/* Added dark mode text color */}
        <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400"> 
          Curated guides and insights for AI-powered developers.
        </p>
      </section>

      {posts.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Added type annotation */}
          {posts.map((post: PostMetadata) => ( 
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              description={post.description}
              publishedAt={post.publishedAt}
              tags={post.tags}
            />
          ))}
        </section>
      ) : (
        <p className="text-center text-neutral-400 text-sm">No guides published yet.</p>
      )}

      <div className="mt-16 text-center">
        {/* Corrected Link usage for App Router */}
        <Link href="/guides" legacyBehavior={false}> 
          <span className="cursor-pointer inline-block text-blue-600 hover:text-blue-700 transition font-medium dark:text-blue-400 dark:hover:text-blue-300"> {/* Added dark mode colors */}
            View All Guides →
          </span>
        </Link>
      </div>
    </main>
  );
}
