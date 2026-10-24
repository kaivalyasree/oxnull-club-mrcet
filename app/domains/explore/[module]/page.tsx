import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { EXPLORE_MODULES, getExploreModuleBySlug } from '@/lib/explore-data';
import ExploreModuleClient from '@/components/ExploreModuleClient';

export function generateStaticParams() {
  return EXPLORE_MODULES.map((m) => ({
    module: m.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: slug } = await params;
  const mod = getExploreModuleBySlug(slug);
  if (!mod) {
    return { title: 'Module Not Found | 0XNULL' };
  }

  return {
    title: `${mod.title} — Non-Technical Development | 0XNULL`,
    description: mod.subtitle
  };
}

export default async function ExploreModulePage({
  params
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: slug } = await params;
  const mod = getExploreModuleBySlug(slug);

  if (!mod) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 text-center text-xs text-[#8A8592]">
          Loading module curriculum & tasks...
        </div>
      }
    >
      <ExploreModuleClient module={mod} />
    </Suspense>
  );
}
