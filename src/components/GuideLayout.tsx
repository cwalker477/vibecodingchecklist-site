import React from 'react';
import { PostMetadata } from '@/lib/posts'; // Use @/ alias now lib is in src

interface GuideLayoutProps {
  meta: PostMetadata;
  children: React.ReactNode;
}

// Helper function to format date nicely (same as in guides index)
function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    console.error("Error formatting date:", isoString, e);
    return isoString; // Fallback
  }
}

const GuideLayout: React.FC<GuideLayoutProps> = ({ meta, children }) => {
  return (
    // Use Inter font (applied via layout), adjust padding/max-width
    <article className="container mx-auto px-6 py-12 md:py-16 max-w-3xl font-sans"> 
      {/* Use dark border color */}
      <header className="mb-10 border-b pb-8 border-neutral-200 dark:border-dark-border">
        {/* Use dark heading color, adjust size/weight */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-neutral-900 dark:text-dark-heading">
          {meta.title}
        </h1>
        {/* Use dark muted color */}
        <div className="flex flex-wrap justify-between items-center text-sm text-neutral-500 dark:text-dark-muted mb-5">
          <span>Published on {formatDate(meta.publishedAt)}</span>
          {meta.readingTime && <span>{meta.readingTime} min read</span>}
        </div>
        {meta.tags && meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              // Use updated tag styles from PostCard
              <span key={tag} className="text-xs font-medium bg-blue-50 dark:bg-dark-accent/10 text-dark-accent px-2.5 py-1 rounded-full">
                {tag} 
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Apply Tailwind Typography styles to the content area */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {/* prose-lg for larger base font size */}
        {/* dark:prose-invert for dark mode styles */}
        {/* max-w-none to prevent prose from setting its own max-width */}
        {children}
      </div>
    </article>
  );
};

export default GuideLayout;
