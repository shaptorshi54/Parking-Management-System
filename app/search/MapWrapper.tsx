"use client";

import dynamic from 'next/dynamic';

// We put the dynamic import INSIDE a "use client" file to bypass the Next.js Server Component restriction!
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className='h-100 w-full bg-muted animate-pulse rounded-xl flex items-center justify-center'>Loading Map...</div>
});

export default function MapWrapper({ lat,lon,lots }: {lat:number,lon:number,lots: any[] }) {
    return <DynamicMap lat={lat} lon={lon} lots={lots} />;
}
