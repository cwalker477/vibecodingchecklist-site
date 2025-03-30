import { getPostData } from '@/lib/posts'; // Use getPostData instead of getSinglePost
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Assuming getPostData returns metadata including title
  const post = await getPostData('guides', params.slug); // Use getPostData
  if (!post) {
    // Handle case where post is not found
    return { title: 'Guide not found' };
  }
  return { title: post.metadata.title };
}

// Optional: Generate static paths if you want to pre-render guides at build time
// export async function generateStaticParams() {
//   const posts = await getAllPostsMetadata('guides'); // Assuming getAllPostsMetadata exists
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const post = await getPostData('guides', params.slug); // Use getPostData

  if (!post) {
    // Handle post not found, e.g., return a 404 component or message
    return <div>Guide not found.</div>;
  }

  // getPostData returns mdxSource (serialized) and metadata
  const { mdxSource, ...metadata } = post; // Destructure mdxSource and remaining metadata

  return (
    // Using GuideLayout for consistency, assuming it provides basic structure
    // If GuideLayout adds unwanted styles, replace with a simple <main> tag
    // <GuideLayout metadata={metadata}>
    <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8"> {/* Added basic padding */}
      <h1 className="text-3xl font-bold mb-6">{metadata.title}</h1> {/* Basic title styling */}
      {/* Using prose for basic MD rendering, remove if causing issues. Ensure prose styles are available or remove class. */}
      <div className="prose prose-invert max-w-none">
        <MDXRemote source={mdxSource} /> {/* Use mdxSource */}
      </div>
    </main>
    // </GuideLayout>
  );
}
