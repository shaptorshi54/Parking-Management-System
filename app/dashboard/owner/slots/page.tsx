import React from 'react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle2, Wrench } from 'lucide-react'

export default async function page() {
  const session = await auth()
  if (!session?.user?.id) return <div>Unauthorized</div>
  const lots = await prisma.parking_Lots.findMany({
    where: { owner_id: session?.user.id },
    include: {
      slots: {
        orderBy: { slot_number: "desc" },
        include: {
          bookings: {
            where: { status: "CONFIRMED" },
            include: { vehicle: true }
          }
        }
      }
    }
  })
  return (
    <div className='mx-auto space-y-8 pb-12 p-4'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Slot Manager</h1>
        <p className='text-muted-foreground mt-1'>Live bird's eye view of your parking lots</p>
      </div>

      {lots.length === 0 ? (
        <div className='text-center py-20 border-dashed rounded-xl bg-muted/10'>
          <h3>No Parking lots found</h3>
          <p>You need to create a parking lot before you can manage slots</p>
        </div>
      ) : (
        <div className='space-y-12'>
          {lots.map((lot) => (
            <div key={lot.id} className='space-y-4'>

              {/* Lot header */}
              <div className='flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm'>
                <div>
                  <h2 className='text-xl font-bold'>{lot.name}</h2>
                  <p className='text-sm text-muted-foreground'>{lot.address}</p>
                </div>
                <div className='flex gap-3'>
                  <Badge variant={`outline`} className='bg-emerald-500/10 text-emerald-500'>
                    {lot.slots.filter(s => s.status === "AVAILABLE").length}  Available
                  </Badge>
                  <Badge variant={`outline`} className='bg-red-500/10 text-red-500'>
                    {lot.slots.filter(s => s.status === "OCCUPIED").length}    Occupied
                  </Badge>
                </div>
              </div>

              {/* Physical Slot Grid */}
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {lot.slots.map((slot) => {
                  const isAvailable = slot.status === "AVAILABLE"
                  const isOccupied = slot.status === "OCCUPIED"
                  const activeBooking = slot.bookings[0]
                  return (
                    <Card key={slot.id} className={`overflow-hidden transition-all duration-200 shadow-sm border-2 ${isAvailable ? `border-emerald-500/50 hover:border-emerald-500 bg-emerald-500/5` : isOccupied ? `border-red-500/50 bg-red-500/5` : `border-yellow-500/50 bg-yellow-500/5`}`}>

                      {/* Accent Strip */}
                      <div className={`absolute top-0 left-0 w-full h-1.5 ${isAvailable ? "bg-emerald-500" : isOccupied ? "bg-red-500" : "bg-yellow-500"}`} />
                      <CardContent className='p-4 flex flex-col items-center justify-center min-h-30 text-center'>
                        <h3 className='text-2xl font-black mb-2'>{slot.slot_number}</h3>

                        {isAvailable && (
                          <div className='flex flex-col items-center text-emerald-600 dark:text-emerald-400'>
                            <CheckCircle2 className='h-6 w-6 mb-1 opacity-50' />
                            <span className='text-[10px] font-bold tracking-widest uppercase'>Available</span>
                          </div>
                        )}

                        {isOccupied && activeBooking && (
                          <div>
                            <span className='text-[10px] font-bold tracking-widest uppercase text-red-600 dark:text-red-400 mb-1'>
                              Occupied
                            </span>
                            <div className='px-2 py-1 bg-[#FBC02D] text-black font-bold text-xs rounded border border-black/80 shadow-sm'>
                              {activeBooking.vehicle.vehicle_number}
                            </div>
                          </div>
                        )}

                        {!isOccupied && !isAvailable && (
                          <div className='flex flex-col items-center text-yellow-600 dark:text-yellow-400'>
                            <Wrench className='h-6 w-6 mb-1 opacity-80'/>
                            <span className='text-[10px] font-bold tracking-widest uppercase'>Maintenance</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
