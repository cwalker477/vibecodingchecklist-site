import { notFound } from 'next/navigation';
import { getBlogPostBySlug, BlogPost } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata, ResolvingMetadata } from 'next';

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
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    // No specific metadata if post not found (notFound will handle the page)
    return {
      title: 'Post Not Found',
    };
  }

  // Optionally merge with parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || 'A blog post from VibeCodingChecklist', // Fallback description
    // openGraph: {
    //   title: post.title,
    //   description: post.excerpt,
    //   images: ['/some-default-image.png', ...previousImages], // Add specific image if available
    // },
  };
}

// --- Optional: Pre-render known slugs at build time ---
// export async function generateStaticParams() {
//   // Fetch all published blog post slugs from Supabase
//   const { data, error } = await supabase
//     .from('blog_posts')
//     .select('slug')
//     .eq('status', 'published');
//
//   if (error || !data) {
//     console.error("Failed to fetch slugs for static generation:", error);
//     return [];
//   }
//
//   return data.map((post) => ({
//     slug: post.slug,
//   }));
// }
// --- End Optional ---


export default async function BlogPostPage({ params }: Props) {
  const slug = params.slug;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound(); // Trigger 404 page if post not found or not published
  }

  // Basic template handling (can be expanded later)
  const LayoutComponent = ({ children }: { children: React.ReactNode }) => (
    <article className="prose dark:prose-invert lg:prose-xl mx-auto py-8 px-4">
       {/* Apply Tailwind Typography styles */}
      <h1>{post.title}</h1>
      {post.published_at && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Published on {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}
      {children}
    </article>
  );

  // Add more layouts based on post.template if needed
  // if (post.template === 'special-layout') { ... }

  return (
    <LayoutComponent>
      <MDXRemote
        source={post.content}
        // Optionally pass components to customize rendering
        // components={{ h1: (props) => <h1 className="text-blue-500" {...props} /> }}
      />
    </LayoutComponent>
  );
}
