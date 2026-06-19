import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'


export default function loading() {
    return (
        <div className='space-y-8 pb-12 p-4 w-full'>

            {/* Header - Skeleton */}
            <div>
                <Skeleton className='h-10 w-64 mb-3' />
                <Skeleton className='h-4 w-96' />
            </div>

            {/* Grid cards skeleton */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {[1, 2, 3].map((i) => (
                    <Card key={i} className='border-border/50 shadow-sm overflow-hidden'>
                        <CardHeader className='pb-2'>
                            <Skeleton className='h-4 w-24' />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className='h-10 w-32 mb-2' />
                            <Skeleton className='h-3 w-48' />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Big list skeleton */}
            <div className='space-y-4 pt-4'>
                <Skeleton className='h-6 w-40 mb-4' />
                <div className='bg-card rounded-xl border-border/50 shadow-sm divide-y divide-border/50'>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className='flex items-center justify-between p-4'>
                            <div className='space-y-2'>
                                <Skeleton className='h-10 w-10 rounded-full'/>
                                <div className='space-y-2 flex flex-col items-end'>
                                    <Skeleton className='h-5 w-16 rounded-full'/>
                                    <Skeleton className='h-4 w-12'/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
