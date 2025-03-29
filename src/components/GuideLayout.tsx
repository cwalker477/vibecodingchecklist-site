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
    <article className="container mx-auto px-4 py-8 max-w-3xl"> {/* Centered, max-width */}
      <header className="mb-8 border-b pb-6 border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white font-serif">
          {meta.title}
        </h1>
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>Published on {formatDate(meta.publishedAt)}</span>
          {meta.readingTime && <span>{meta.readingTime} min read</span>}
        </div>
        {meta.tags && meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-800 px-2.5 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                #{tag}
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
