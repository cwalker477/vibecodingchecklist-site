import Link from 'next/link';
import { getAllPublishedGuidesMetadata, GuideMetadata } from '@/lib/guides'; // Import from new guides lib
import PostCard from '@/components/PostCard'; // Import PostCard

export const metadata = {
  title: 'Guides | Vibe Coding Checklist',
  description: 'Browse all guides, checklists, and brain dumps on AI-assisted development.',
};

// Revalidate data periodically (e.g., every hour) or on-demand
export const revalidate = 3600; // Revalidate every hour

// Removed formatDate helper, PostCard handles it

export default async function GuidesIndexPage() { // Make component async
  let allGuides: GuideMetadata[] = [];
  try {
    // Fetch metadata for all published guides from Supabase
    allGuides = await getAllPublishedGuidesMetadata(); // Already sorted newest first
  } catch (error) {
    console.error("Failed to fetch guides:", error);
    // Optionally render an error state
  }

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
          {allGuides.map((guide) => ( // Use GuideMetadata type implicitly
            <PostCard
              key={guide.slug}
              href={`/guides/${guide.slug}`} // Construct href
              title={guide.title}
              description={guide.excerpt || ''} // Use excerpt, provide default
              publishedAt={guide.published_at} // Use published_at
              tags={guide.tags}
              // Add other props like featured_image_url if PostCard is updated to support them
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
