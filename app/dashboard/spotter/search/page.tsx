// "use client"

import { prisma } from '@/lib/prisma';
import MapWrapper from '@/app/components/MapWrapper';
import { IndianRupee, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SearchBar from '../../../components/LocationSearchBar';

export default async function page() {
  const availableSlots = await prisma.parking_Lots.findMany()
  return (
    <div className='space-y-8 p-4 pb-20'>
      {/* Header & Search Bar */}
      <div className='space-y-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Find Parking</h1>
          <p className='text-muted-foreground'>Explore available spots around you</p>
        </div>
        <div className='relative max-w-xl'>
          <SearchBar />
        </div>
      </div>

      {/* Interactive Map */}
      <div className='rounded-xl border border-border shadow-sm p-1'>
        <MapWrapper lots={availableSlots} />
      </div>

      {/* list of parking lots */}
      <div className='space-y-4'>
        <h2 className='text-xl font-semibold tracking-tight'>Nearby Lots</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {availableSlots.map((lot) => (
            <Card key={lot.id} className='hover:border-primary/50 transition-colors shadow-sm'>
              <CardContent className='p-4 flex flex-col sm:flex-row justify-between gap-4'>
                {/* Left side info */}

                <div className='space-y-2 flex-1'>
                  <h3 className='font-bold text-lg leading-none'>{lot.name}</h3>
                  <p className='text-sm text-muted-foreground flex items-center gap-1'><MapPin className='h-3 w-3'/>{lot.address}</p>

                  {/* Badges (Amenities) */}
                  <div className='flex flex-wrap gap-1 mt-2'>
                    <Badge variant={`secondary`} className='text-[10px]'>EV Charging</Badge>
                    <Badge variant={`secondary`} className='text-[10px]'>CCTV</Badge>
                  </div>
                </div>

                {/* Right Side: Price & Action */}
                <div className='flex flex-row sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4 min-w-30'>
                  <div className='text-right w-full flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end mb-4 sm:mb-0'>
                    <p className='text-xs text-muted-foreground sm:mb-1'>Price</p>
                    <p className='font-bold text-xl flex items-center justify-end text-primary'>
                      <IndianRupee className='h-4 w-4'/>{lot.pricePerHour}<span className='text-xs text-muted-foreground font-normal ml-1'>/hr</span>
                    </p>
                  </div>

                  {/* The Book button takes to the checkout page */}
                  <Link href={`/dashboard/spotter/lots/${lot.id}`} className='w-full sm:mt-3'>
                    <Button className='w-full'>Book Spot</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {availableSlots.length === 0 && (
          <div>
            <p>No parking found in your area</p>
          </div>
        )}
      </div>
    </div>
  )
}
