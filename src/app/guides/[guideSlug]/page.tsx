import { notFound } from 'next/navigation';
// Removed duplicate import
import { getGuideBySlug, getAllPublishedGuidesMetadata, Guide } from '@/lib/guides';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata, ResolvingMetadata } from 'next';
import GuideLayout from '@/components/GuideLayout'; // Restore layout import

// Restore revalidate
export const revalidate = 3600;

type Props = {
  // Use the renamed parameter here
  params: { guideSlug: string };
};

// Generate metadata dynamically based on the post
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Use the renamed parameter here
  const slug = params.guideSlug;
  const guide = await getGuideBySlug(slug);

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

// Generate static paths for all published guides
export async function generateStaticParams() {
  const guides = await getAllPublishedGuidesMetadata();
  // Return the renamed parameter here
  return guides.map((guide) => ({
    guideSlug: guide.slug,
  }));
}

export default async function GuidePage({ params }: Props) {
  // Use the renamed parameter here
  const slug = params.guideSlug;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // guide includes mdxSource and all other Guide fields
  const { mdxSource, ...guideData } = guide;

  // --- Restore original rendering logic ---
  return (
    <GuideLayout meta={guideData}>
      <MDXRemote source={mdxSource} />
    </GuideLayout>
  );
  /* Original code with debug:
  const { mdxSource, ...guideData } = guide;
  return (
    <main className="p-8 font-mono text-xs">
      <h1>Debug: Serialized mdxSource Output & MDXRemote Render</h1>
      <hr className="my-4"/>
      <h2>Serialized Output:</h2>
      <pre className="whitespace-pre-wrap break-words border p-2 my-2 bg-neutral-100 dark:bg-neutral-800">
        {JSON.stringify(mdxSource, null, 2)}
      </pre>
      <hr className="my-4"/>
      <h2>MDXRemote Render Attempt:</h2>
      <div className="prose dark:prose-invert max-w-none mt-4 border p-4 border-dashed">
        <MDXRemote source={mdxSource} />
      </div>
    </main>
  );
  */
  /* Original code:
  return (
    <GuideLayout meta={guideData}>
      <MDXRemote source={mdxSource} />
    </GuideLayout>
  );
  */
}
