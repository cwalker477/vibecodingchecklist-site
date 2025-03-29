// Removed "use client" as data fetching happens server-side now
import Link from 'next/link';
import { motion } from 'framer-motion'; // Keep client-side motion
// Use @/ alias now that lib and components are in src
import { getAllPostsMetadata, PostMetadata } from '@/lib/posts'; 
import PostCard from '@/components/PostCard'; 

export default function HomePage() {
  // Fetch the latest 3 guides
  const latestGuides = getAllPostsMetadata('guides').slice(0, 3);

  return (
    <main className="px-4 md:px-10 max-w-5xl mx-auto py-12 md:py-20"> {/* Added padding */}
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 md:mb-16 text-center"
      >
        <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
          The Vibe Coding Checklist
        </h1>
        <p className="font-sans text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
          A living system for coding with clarity, creativity, and confidence.
          Built for devs, designers, and dreamers who want more than just best practices.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center mb-16 md:mb-24"
      >
        <Link href="/guides">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium transition-transform duration-200 ease-in-out"
          >
            Explore the Guides
          </motion.button>
        </Link>
      </motion.div>

      {/* Featured Guides Preview - Now Dynamic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-3xl font-serif font-semibold mb-8 text-center dark:text-neutral-100">Featured Guides</h2>
        {latestGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Add explicit type for guide */}
            {latestGuides.map((guide: PostMetadata) => ( 
              // Render PostCard with dynamic data
              <PostCard
                key={guide.slug}
                slug={guide.slug}
                title={guide.title}
                publishedAt={guide.publishedAt}
                description={guide.description}
                tags={guide.tags}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">No featured guides available yet.</p>
        )}
      </motion.div>
    </main>
  );
}
