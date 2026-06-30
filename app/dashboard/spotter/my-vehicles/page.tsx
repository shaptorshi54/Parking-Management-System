import React from 'react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Bike, Car, Plus, Trash2, Truck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


import { auth } from '@/auth'

export default async function page() {
  const session = await auth()
  const myVehicles = await prisma.vehicles.findMany({
    where: {
      user_id: session?.user?.id
    }
  })
  return (
    <div className='space-y-8 pb-12'>

      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight mb-2'>My Garage</h1>
          <p className='text-muted-foreground mt-1 text-sm'>Manage your saved vehicles for faster checkout</p>
        </div>

        {/* Button for adding vehicle */}
        <Link href={`/dashboard/spotter/search`}>
          <Button className='gap-2'>
            <Plus />Add Vehicle
          </Button>
        </Link> 
      </div>

      {/* vehicle grid */}
      {myVehicles.length === 0 ? (
        <div className='text-center py-20 border-2 border-dashed border-border rounded-xl bg-muted/10'>
          <Car className='h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4' />
          <h3 className='font-jetBrains'>Your garage is empty</h3>
          <p>Add your car or bike to make booking a parking spot instantly fast</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {myVehicles.map((vehicle) => {
            const Icon = vehicle.type === "BIKE" ? Bike : vehicle.type === "MPV" ? Truck : Car
            return (
              <Card key={vehicle.id} className='border-border/50 shadow-sm hover:shadow-md transition-shadow'>
                <CardHeader className='bg-muted/50 pb-4 border-b border-border'>
                  <div className='flex justify-between items-start'>
                    <div className='bg-background p-2.5 rounded-lg shadow-sm border'>
                      <Icon className='h-6 w-6 text-primary' />
                    </div>
                    <Button variant={`ghost`} className='h-8 w-8 text-muted-foreground hover:text-destructive'>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                  <CardTitle className='text-xl mt-4'>{vehicle.vehicle_model}</CardTitle>
                  <p className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>{vehicle.type}</p>
                </CardHeader>
                <CardContent className='pt-6 pb-6 bg-card'>
                  <div className='space-y-1'>
                    <p className='text-xs text-muted-foreground'>License Plate</p>
                    <div className='inline-flex items-center justify-center px-3 py-1.5 bg-[#FBC02D] text-black font-bold text-lg rounded border-2 border-black/80 shadow-sm shadow-black/10'>
                      {vehicle.vehicle_number}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
