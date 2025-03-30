import Link from 'next/link';
import { getAllPostsMetadata, PostMetadata } from '@/lib/posts'; // Use @/ alias
import PostCard from '@/components/PostCard'; // Import PostCard

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
    // Use Inter font (applied via layout), adjust padding/max-width, add dark mode text
    <div className="container mx-auto px-6 py-16 md:py-24 max-w-4xl font-sans text-neutral-800 dark:text-dark-text">
      {/* Use dark heading color, adjust size/weight */}
      <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-center text-neutral-900 dark:text-dark-heading">All Guides</h1>

      {allGuides.length === 0 ? (
         // Use dark muted color
        <p className="text-center text-neutral-500 dark:text-dark-muted">No guides published yet.</p>
      ) : (
        // Use PostCard component for consistency in a grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allGuides.map((guide: PostMetadata) => ( // Added type annotation
            <PostCard
              key={guide.slug}
              slug={guide.slug}
              title={guide.title}
              description={guide.description}
              publishedAt={guide.publishedAt}
              tags={guide.tags}
              // readingTime prop is not accepted by PostCard currently, can be added if needed
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Note: This page uses server-side rendering by default in App Router.
// If content changes frequently, consider adding revalidation options.
// export const revalidate = 60; // Revalidate every 60 seconds, for example
