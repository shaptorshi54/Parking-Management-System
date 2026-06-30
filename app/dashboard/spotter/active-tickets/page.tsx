import React from 'react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Calendar, Clock, MapPin, QrCode, Navigation } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default async function page() {
  const session = await auth()
  const activeBookings = await prisma.bookings.findMany({
    where: {
      user_id: session?.user?.id,
      status: "CONFIRMED",
      booking_end: { gt: new Date() }
    },
    include: {
      slots: { include: { lot: true } },
      vehicle: true
    },
    orderBy: {
      booking_start: "desc"
    }
  })
  return (
    <div className='space-y-8'>
      {/* header */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Active Tickets</h1>
        <p className='text-muted-foreground'>Your current parking passes</p>
      </div>

      {/* Ticket Feed */}

      {activeBookings.length === 0 ? (
        <div className='text-center py-20 border-2 border-dashed border-border rounded-xl bg-muted/10'>
          <QrCode className='h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4' />
          <h3 className='text-lg font-semibold'>No active parking sessions</h3>
          <p className='text-muted-foreground text-sm max-w-sm mx-auto mt-2 mb-6'>You don't have any spots booked right now. Find a spot to park!</p>

          <Link href={`/dashboard/spotter/search`}>
            <Button>Find Parking</Button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {activeBookings.map((booking: { id: string, slots: { lot: { address: string, name: string }, slot_number: number }, booking_start: Date, booking_end: Date, vehicle: { vehicle_number: string } }) => (
            <Card key={booking.id} className='border-border/50 shadow-lg relative bg-card'>

              <div className='h-2 w-full bg-emerald-500 absolute top-0 left-0' />

              <CardHeader className='pt-6 pb-2 border-b border-border/50 bg-muted/20'>
                <div className='flex justify-between items-start'>
                  <div className=''>
                    <Badge className='bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0 mb-2'>
                      <span className='relative flex h-2 w-2 mr-2'>
                        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
                        <span className='inline-flex h-2 w-2 rounded-full bg-emerald-500' />
                      </span>
                      LIVE PASS
                    </Badge>
                    <h2 className='text-2xl font-bold'>{booking.slots.lot.name}</h2>
                    <p className='flex items-center gap-1 mt-1 text-muted-foreground'><MapPin className='h-4 w-4' />{booking.slots.lot.address}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='pt-6 space-y-4'>
                {/* Time Info */}
                <div className='grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border/50'>
                  <div>
                    <p className='text-xs text-muted-foreground flex items-center gap-1 mb-1'><Calendar className='h-4 w-4' />Entry Time</p>
                    <p className='font-semibold text-sm'>{format(new Date(booking.booking_start), "hh:mm a")}</p>
                  </div>
                  <div>
                    <p className='flex items-center text-muted-foreground  gap-1 mb-1'><Clock className='h-4 w-4' />Exit Before</p>
                    <p className='font-semibold text-sm text-destructive'>{format(new Date(booking.booking_end), "hh:mm a")}</p>
                  </div>
                </div>

                {/* Spot & Vehicle Info */}
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-xs text-muted-foreground mb-1'>Assigned Slot</p>
                    <p className='text-xl font-bold tracking-wider'>{booking.slots.slot_number}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-xs text-muted-foreground mb-1'>Vehicle</p>
                    <div className='inline-flex items-center px-2 py-1 bg-[#FBC02D] text-black font-bold text-sm rounded border-2 border-black/80'>
                      {booking.vehicle.vehicle_number}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='bg-muted/10 border-t border-border pt-4 pb-4'>
                <Button className='w-full gap-2 text-md h-12'>
                  <Navigation className='h-4 w-4 text-blue-500' />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
