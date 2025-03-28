import Link from 'next/link';
import { getAllPosts } from '@/lib/posts'; // Import the function to get posts
import PostCard from '@/components/PostCard'; // Import the PostCard component

export default function Home() {
  // Fetch all guide posts metadata
  const allGuides = getAllPosts('guides');
  // You might want to limit the number of posts shown, e.g., slice(0, 3)
  const featuredGuides = allGuides.slice(0, 3); // Show latest 3 guides

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Master the Art of Vibe Coding</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Your central hub for guides, tool comparisons, and AI coding insights.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/guides/getting-started-with-vibe-coding" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Start Learning
          </Link>
          <Link href="/comparisons" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Compare Tools
          </Link>
        </div>
      </section>

      {/* Latest Guides Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Latest Guides</h2>
        {featuredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Render PostCard for each guide */}
            {featuredGuides.map((guide) => (
              <PostCard
                key={guide.slug}
                slug={guide.slug}
                title={guide.title}
                date={guide.date}
                description={guide.description}
                tags={guide.tags}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No guides available yet.</p>
        )}
        {/* Optional: Link to see all guides */}
        {allGuides.length > 3 && (
           <div className="text-center mt-8">
             <Link href="/guides" className="text-blue-600 hover:underline dark:text-blue-400">
               View All Guides →
             </Link>
           </div>
         )}
      </section>

      {/* Tool Tracker Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Tool Tracker</h2>
        <div className="text-center text-gray-500 dark:text-gray-400">
          [Tool comparison snippet placeholder - e.g., Logos of Cline, Cursor, Bolt]
        </div>
      </section>

      {/* Social Pulse Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Latest Updates & Trends</h2>
        <div className="text-center text-gray-500 dark:text-gray-400">
          [Latest model drops and social trends placeholder]
        </div>
      </section>

      {/* Footer will be handled in layout.tsx or a dedicated component */}
    </div>
  );
}
