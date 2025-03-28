// src/app/guides/[slug]/page.tsx

// Removed generateStaticParams and generateMetadata for debugging

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  return <div className="p-8 text-white">Guide slug: {params.slug}</div>;
}
