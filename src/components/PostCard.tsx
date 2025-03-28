import Link from 'next/link';

// Define the props type based on the data returned by getAllPosts
type PostCardProps = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
};

export default function PostCard({ slug, title, date, description, tags }: PostCardProps) {
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
        {new Date(date).toLocaleDateString()}
      </div>
      {/* Optional: Display tags later */}
      {/* {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )} */}
    </Link>
  );
}
