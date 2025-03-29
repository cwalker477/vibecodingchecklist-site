import type { Metadata } from 'next';

export async function generateStaticParams() {
  return [{ slug: 'example-guide' }];
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  return {
    title: `Guide: ${params.slug}`,
  };
}

export default async function Page({ params }: any) {
  return (
    <main className="p-8 text-white">
      <h1 className="text-2xl font-bold">Loaded Guide: {params.slug}</h1>
    </main>
  );
}
