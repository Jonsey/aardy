import { Suspense } from 'react';
import { getJellyBeans } from '../lib/api';
import StaticMetadata from '../components/StaticMetadata';
import InfiniteJellyBeanList from '../components/InfiniteJellyBeanList';
import JellyBeanListSkeleton from '../components/JellyBeanListSkeleton';

// This component only handles data fetching - no static content mixed in
async function JellyBeanDataLoader() {
  const jellyBeans = await getJellyBeans();
  return <InfiniteJellyBeanList jellyBeans={jellyBeans} />;
}

export default function Home() {
  return (
    <div role="application" aria-label="Jelly Bean Collection Browser">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Static metadata - renders immediately, no data dependency */}
          <StaticMetadata />
        </div>
        
        {/* Only dynamic content waits for data fetching */}
        <Suspense fallback={<JellyBeanListSkeleton />}>
          <JellyBeanDataLoader />
        </Suspense>
      </div>
    </div>
  );
}
