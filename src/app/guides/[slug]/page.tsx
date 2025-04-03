import { notFound } from 'next/navigation';
import { getGuideBySlug, Guide } from '@/lib/guides'; // Import from new guides lib
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata, ResolvingMetadata } from 'next'; // Import Metadata types

// Revalidate data periodically or on-demand
export const revalidate = 3600; // Revalidate every hour

type Props = {
  params: { slug: string };
};

// Generate metadata dynamically based on the post
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const guide = await getGuideBySlug(slug); // Use getGuideBySlug

  if (!guide) {
    // No specific metadata if guide not found (notFound will handle the page)
    return {
      title: 'Guide Not Found',
    };
  }

  // Optionally merge with parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${guide.title} | Guides`, // Use guide title
    description: guide.excerpt || 'A guide from VibeCodingChecklist', // Fallback description
    // openGraph: {
    //   title: guide.title,
    //   description: guide.excerpt,
    //   images: [guide.featured_image_url || '/some-default-image.png', ...previousImages],
    // },
  };
}

// Optional: Generate static paths if you want to pre-render guides at build time
// export async function generateStaticParams() {
//   const posts = await getAllPostsMetadata('guides'); // Assuming getAllPostsMetadata exists
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }

export default async function GuidePage({ params }: Props) { // Use Props type
  const slug = params.slug;
  const guide = await getGuideBySlug(slug); // Use getGuideBySlug

  if (!guide) {
    notFound(); // Trigger 404 page if guide not found or not published
  }

  // guide includes mdxSource and all other Guide fields
  const { mdxSource, ...guideMetadata } = guide;

  return (
    // Using GuideLayout for consistency, assuming it provides basic structure
    // If GuideLayout adds unwanted styles, replace with a simple <main> tag
    // <GuideLayout metadata={guideMetadata}> // Pass guideMetadata if using layout
    <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8"> {/* Added basic padding */}
      <h1 className="text-3xl font-bold mb-6">{guideMetadata.title}</h1> {/* Use guide title */}
      {/* Add other metadata display here if needed - e.g., published date, author */}
      {guideMetadata.published_at && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Published on {new Date(guideMetadata.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}
      {/* Using prose for basic MD rendering. Ensure @tailwindcss/typography is configured */}
      <div className="prose dark:prose-invert max-w-none">
        <MDXRemote source={mdxSource} /> {/* Use mdxSource from guide */}
      </div>
    </main>
    // </GuideLayout>
  );
}
