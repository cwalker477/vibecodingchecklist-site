// src/app/guides/[slug]/page.tsx

import type { Metadata } from 'next';

export const generateStaticParams = async () => {
  return [{ slug: 'example-guide' }];
};

export const generateMetadata = ({
  params,
}: {
  params: { slug: string };
}): Metadata => {
  return {
    title: `Guide: ${params.slug}`,
  };
};

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main className="p-8 text-white">
      <h1 className="text-2xl font-bold">Guide Slug: {params.slug}</h1>
    </main>
  );
}
