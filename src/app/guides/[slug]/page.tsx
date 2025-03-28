import { getAllPostIds, getPostData } from '@/lib/posts';
import { notFound } from 'next/navigation';
// import Head from 'next/head'; // No longer needed with App Router metadata API
import { Metadata } from 'next'; // Import Metadata type
import TableOfContents from '@/components/TableOfContents'; // Import the TOC component
import BackToTop from '@/components/BackToTop'; // Import the BackToTop component

// Define the props type for the Page component
type PageProps = {
  params: {
    slug: string;
  };
};

// Generate static paths for all guides
export async function generateStaticParams() {
  const paths = getAllPostIds('guides'); // Get slugs for the 'guides' subdirectory
  return paths.map(p => ({ slug: p.params.slug }));
}

// Generate metadata for the page
// Use inline type for params here as well for consistency
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const postData = await getPostData('guides', params.slug);
    return {
      title: postData.title,
      description: postData.description || 'A guide from VibeCodingChecklist.com', // Use frontmatter description if available
    };
  } catch (error) {
    // Handle case where post data might not be found during metadata generation
    return {
      title: 'Guide Not Found',
      description: 'This guide could not be found.',
    };
  }
}

// Define the page component using the PageProps type
export default async function Page({ params }: PageProps) {
  let postData;
  try {
    // Fetch necessary data for the blog post using params.slug
    postData = await getPostData('guides', params.slug);
  } catch (error) {
    // If getPostData throws (e.g., file not found), trigger a 404
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:flex lg:flex-row lg:gap-8">
      {/* Main Content Area */}
      <article className="w-full lg:w-3/4 prose dark:prose-invert lg:prose-xl max-w-none"> {/* Allow prose to take full width */}
        {/* Render post title */}
        <h1 className="text-3xl font-bold mb-4">{postData.title}</h1>

        {/* Render post date and read time */}
        <div className="text-gray-500 dark:text-gray-400 mb-8 flex items-center space-x-2 text-sm">
          <span>Published on {new Date(postData.date).toLocaleDateString()}</span>
          {postData.author && <span>by {postData.author}</span>}
          {postData.readTime && <span>· 🕒 {postData.readTime} min read</span>}
        </div>

        {/* Render post content */}
        {/* Add scroll-mt-24 (or similar) to heading tags via rehype plugin if needed for scroll offset */}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>

      {/* Sidebar Area */}
      <aside className="hidden lg:block lg:w-1/4 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
        {/* Render Table of Contents */}
        <TableOfContents headings={postData.headings} />
      </aside>

      {/* Render Back to Top Button */}
      <BackToTop />
    </div> // Add the missing closing div tag
  );
}
