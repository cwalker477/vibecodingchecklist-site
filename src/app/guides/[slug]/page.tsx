import { notFound } from 'next/navigation';
import { getGuideBySlug, getAllPublishedGuidesMetadata, Guide } from '@/lib/guides'; // Import getAllPublishedGuidesMetadata
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata, ResolvingMetadata } from 'next';
import GuideLayout from '@/components/GuideLayout'; // Import the layout component

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

// Generate static paths for all published guides
export async function generateStaticParams() {
  const guides = await getAllPublishedGuidesMetadata(); // Use the correct function
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export default async function GuidePage({ params }: Props) {
  const slug = params.slug;
  const guide = await getGuideBySlug(slug); // Use getGuideBySlug

  if (!guide) {
    notFound(); // Trigger 404 page if guide not found or not published
  }

  // guide includes mdxSource and all other Guide fields
  // Rename guideMetadata to avoid conflict with the meta prop name in GuideLayout
  const { mdxSource, ...guideData } = guide;

  return (
    // Use the GuideLayout component, passing the fetched guide data
    <GuideLayout meta={guideData}>
      {/* Render the MDX content inside the layout */}
      <MDXRemote source={mdxSource} />
    </GuideLayout>
  );
}
