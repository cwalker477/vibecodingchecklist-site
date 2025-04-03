import Link from 'next/link';

// Define props explicitly for reusability
interface PostCardProps {
  href: string; // Accept full href directly
  title: string;
  publishedAt?: string; // Make date optional
  description?: string; // Make description optional
  tags?: string[]; // Make tags optional
}

// Helper function to format date nicely
function formatDate(isoString: string | undefined): string {
  if (!isoString) return ''; // Handle undefined date
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


export default function PostCard({ href, title, publishedAt, description, tags }: PostCardProps) {
  return (
    <Link
      href={href} // Use the passed href
      // Updated card styles: rounded-2xl, dark-card bg, dark-border, shadow-lg on hover
      className="block bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 transition-all duration-300 ease-in-out group hover:shadow-lg hover:-translate-y-1"
    >
      {/* Updated heading styles: dark-heading color, accent on hover */}
      <h3 className="font-semibold text-lg md:text-xl mb-2 text-neutral-900 dark:text-dark-heading group-hover:text-dark-accent transition-colors">
        {title}
      </h3>
      {description && (
         // Updated description styles: dark-muted color
        <p className="text-sm text-neutral-600 dark:text-dark-muted mb-4 line-clamp-2"> 
          {description}
        </p>
      )}
      {publishedAt && ( // Conditionally render date if provided
         // Updated meta styles: dark-muted color
        <div className="text-xs text-neutral-500 dark:text-dark-muted">
          {formatDate(publishedAt)}
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2"> {/* Increased margin-top */}
          {tags.map((tag) => (
             // Updated tag styles: accent color text, lighter bg
            <span key={tag} className="text-xs font-medium bg-blue-50 dark:bg-dark-accent/10 text-dark-accent px-2.5 py-1 rounded-full"> 
              {tag} 
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
