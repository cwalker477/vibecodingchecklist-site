import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc'; // Import RSC version
import { getAllPostSlugs, getPostData, PostMetadata } from '../../../../lib/posts'; // Correct relative path for root lib
import GuideLayout from '@/components/GuideLayout'; // Keep @/ alias for src components
import remarkGfm from 'remark-gfm'; // Ensure plugins used during serialization are available for rendering if needed
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// Define the props type for the page component
interface GuidePageProps {
  params: {
    slug: string;
  };
}

// Generate static paths for all guides at build time
export async function generateStaticParams() {
  // Use @/ alias
  const paths = getAllPostSlugs('guides'); // Get slugs from lib/posts
  return paths; // Returns [{ params: { slug: '...' } }, ...]
}

// Generate dynamic metadata for each guide page
export async function generateMetadata({ params }: GuidePageProps): Promise<{ title: string; description: string }> {
  try {
    // Use @/ alias
    const postData = await getPostData('guides', params.slug);
    return {
      title: `${postData.title} | Vibe Coding Checklist`,
      description: postData.description || 'A guide from Vibe Coding Checklist.',
      // Add other metadata like open graph tags here if needed
    };
  } catch (error) {
    // Handle case where post data fetch fails (e.g., file not found)
    // Although notFound() in the page component handles rendering,
    // providing default metadata might be good practice.
    console.error(`Error fetching metadata for slug "${params.slug}":`, error);
    return {
      title: 'Guide Not Found | Vibe Coding Checklist',
      description: 'The requested guide could not be found.',
    };
  }
}


// The main page component
export default async function GuidePage({ params }: GuidePageProps) {
  let postData: Awaited<ReturnType<typeof getPostData>>;

  try {
    // Fetch the specific post data, including serialized MDX source
    // Use @/ alias
    postData = await getPostData('guides', params.slug);
  } catch (error) {
    // If getPostData throws (e.g., file not found), trigger a 404
    console.error(`Error fetching post data for slug "${params.slug}":`, error);
    notFound();
  }

  // Extract metadata and MDX source
  const { mdxSource, ...meta } = postData;

  // Define components to be used within MDX (optional)
  // const components = {
  //   // Example: Custom component for h2 tags
  //   // h2: (props) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
  //   // Add other custom components here
  // };

  return (
    // Use @/ alias
    <GuideLayout meta={meta}>
      {/* Render the MDX content */}
      {/* Pass optional components if defined */}
      <MDXRemote
        source={mdxSource}
        // components={components}
        options={{
            mdxOptions: {
              // Pass the same plugins used during serialization if they affect output/rendering
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
            }
        }}
      />
    </GuideLayout>
  );
}
