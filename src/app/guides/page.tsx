import Link from 'next/link';
import { getAllPostsMetadata } from '@/lib/posts'; // Use @/ alias

export const metadata = {
  title: 'Guides | Vibe Coding Checklist',
  description: 'Browse all guides, checklists, and brain dumps on AI-assisted development.',
};

// Helper function to format date nicely
function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    console.error("Error formatting date:", isoString, e);
    return isoString; // Fallback to original string
  }
}

export default function GuidesIndexPage() {
  // Fetch metadata for all posts in the 'guides' directory
  const allGuides = getAllPostsMetadata('guides'); // Already sorted newest first

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">All Guides</h1>

      {allGuides.length === 0 ? (
        <p className="text-center text-gray-600">No guides published yet.</p>
      ) : (
        <div className="space-y-8">
          {allGuides.map((guide) => (
            <article key={guide.slug} className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                  {guide.format || 'Guide'} {/* Display format */}
                </span>
                <span className="text-sm">{formatDate(guide.publishedAt)}</span>
              </div>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <Link href={`/guides/${guide.slug}`} className="hover:underline">
                  {guide.title}
                </Link>
              </h2>
              <p className="mb-4 font-light text-gray-600 dark:text-gray-400">
                {guide.description}
              </p>
              <div className="flex justify-between items-center">
                <Link href={`/guides/${guide.slug}`} className="inline-flex items-center font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Read more
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </Link>
                <div className="text-sm text-gray-500">
                  {guide.readingTime ? `${guide.readingTime} min read` : ''}
                </div>
              </div>
              {guide.tags && guide.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {guide.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

// Note: This page uses server-side rendering by default in App Router.
// If content changes frequently, consider adding revalidation options.
// export const revalidate = 60; // Revalidate every 60 seconds, for example
