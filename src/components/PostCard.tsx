import Link from 'next/link';

import { PostMetadata } from '@/lib/posts'; // This alias should now work correctly

// Update props to use PostMetadata fields
type PostCardProps = Pick<PostMetadata, 'slug' | 'title' | 'publishedAt' | 'description' | 'tags'>;

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
    return isoString; // Fallback
  }
}


export default function PostCard({ slug, title, publishedAt, description, tags }: PostCardProps) {
  return (
    <Link
      href={`/guides/${slug}`} // Link to the specific guide page
      className="block border rounded-lg p-4 dark:border-gray-700 hover:shadow-md dark:hover:border-gray-500 transition-shadow duration-200 ease-in-out group"
    >
      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"> {/* Limit description lines */}
          {description}
        </p>
      )}
      <div className="text-xs text-gray-500 dark:text-gray-500">
        {formatDate(publishedAt)} {/* Use publishedAt and format */}
      </div>
      {/* Uncommented and updated tag display */}
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2"> {/* Added margin-top */}
          {tags.map((tag) => (
            <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"> {/* Consistent tag style */}
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
