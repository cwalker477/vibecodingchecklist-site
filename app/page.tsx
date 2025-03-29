import React from 'react';
import Link from 'next/link';
// Corrected imports using @/ alias
import { getAllPostsMetadata, PostMetadata } from '@/lib/posts'; 
import PostCard from '@/components/PostCard'; 

// Mark as async since getAllPostsMetadata might be async in the future, 
// although currently it's synchronous file reading.
// Also, add type annotation for posts map parameter.
export default function HomePage() { 
  // Fetch metadata for all guides from the "guides" directory.
  const posts = getAllPostsMetadata('guides');

  return (
    <main className="p-8">
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold">Vibe Coding Checklist</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300"> {/* Added dark mode text */}
          Your source for guides, checklists, and brain dumps on AI-assisted coding.
        </p>
      </section>
      {posts && posts.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <p className="text-center text-gray-600 dark:text-gray-400">No guides found. Check back later.</p>
      )}
      <section className="mt-8 text-center">
        {/* Corrected Link usage for App Router */}
        <Link href="/guides" legacyBehavior={false}> 
          <span className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            View All Guides
          </span>
        </Link>
      </section>
    </main>
  );
}
