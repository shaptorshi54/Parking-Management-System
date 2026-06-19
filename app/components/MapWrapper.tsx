"use client";

import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./ParkingMap'), {
  ssr: false,
  loading: () => <div className='h-[500px] w-full bg-muted animate-pulse rounded-xl flex items-center justify-center'>Loading Map...</div>
});

export default function MapWrapper({ lots }: { lots: any[] }) {
    return <DynamicMap lots={lots} />;
}
