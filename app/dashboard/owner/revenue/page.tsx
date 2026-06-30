import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CreditCard, IndianRupee, TrendingUp } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { format } from 'date-fns'
import React from 'react'

export default async function page() {
    const session = await auth()
    if (!session?.user.id) return <div>Unauthorized</div>

    const ownerLots = await prisma.parking_Lots.findMany({
        where: {
            owner_id: session.user.id,
        },
        select: { id: true }
    })

    const lotIds = ownerLots.map((lot: { id: string }) => lot.id)

    const allBookings = await prisma.bookings.findMany({
        where: {
            slots: { lot_id: { in: lotIds } },
            status: { in: ["CONFIRMED", "COMPLETED"] }
        },
        include: {
            slots: { include: { lot: true } },
            vehicle: true,
            user: true
        },
        orderBy: {
            booking_start: "desc"
        }
    })

    const totalRevenue = allBookings.reduce((sum: number, b: { total_price: number }) => sum + b.total_price, 0)
    const today = new Date().toDateString()
    const todayBookings = allBookings.filter((b: { booking_start: Date }) => new Date(b.booking_start).toDateString() === today)

    const todayRevenue = todayBookings.reduce((sum: number, b: { total_price: number }) => sum + b.total_price, 0)
    return (
        <div className='space-y-8 pb-12 p-4'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Financial Overview</h1>
                <p className='text-muted-foreground mt-1'>Track your parking lot revenue and recent transactions</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card className='border-primary/20 bg-primary/5 shadow-sm'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                        <IndianRupee className='h-4 w-4 text-primary' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-4xl font-black text-primary flex items-center'>
                            <IndianRupee className='h-7 w-7' />
                            {totalRevenue.toLocaleString()}
                        </div>
                        <p className='text-xs text-muted-foreground mt-1 flex items-center'>
                            <TrendingUp className='h-3 w-3 mr-1 text-emerald-500' />Lifetime Earnings
                        </p>
                    </CardContent>
                </Card>
                <Card className='shadow-sm'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle>Today's Revenue</CardTitle>
                        <Activity className='h-4 w-4 text-emerald-500' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-4xl font-black flex items-center'>
                            <IndianRupee className='h-7 w-7' />
                            {todayRevenue.toLocaleString()}
                        </div>
                        <p className='text-xs text-muted-foreground mt-1'>
                            {todayBookings.length} {todayBookings.length > 1 ? "bookings" : "booking"} today
                        </p>
                    </CardContent>
                </Card>

                <Card className='shadow-sm'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Bookings</CardTitle>
                        <CreditCard className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-4xl font-black'>{allBookings.length}</div>
                        <p className='text-xs text-muted-foreground mt-1'>Successful Transactions</p>
                    </CardContent>
                </Card>
            </div>

            <div className='space-y-4 pt-4'>
                <h2 className='text-xl font-bold tracking-tight'>Recent Transactions</h2>
                {allBookings.length === 0 ? (
                    <div className='text-center py-10 border-dashed rounded-xl'>
                        <p className='text-muted-foreground'>No revenue data yet.</p>
                    </div>
                ) : (
                    <div className='bg-card rounded-xl border shadow-sm'>
                        {allBookings.map((booking: { id: string, slots: { lot: { name: string }, slot_number: number }, user: { name: string }, vehicle: { vehicle_number: string }, booking_start: Date, total_price: number }, index:number) => (
                            <div key={`${booking.id}-${index}`} className='flex items-center justify-between p-4 border-b border-border/50 hover:bg-muted/30 transition-colors'>
                                <div className='flex items-center gap-4'>
                                    <div className='h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600'>
                                        <TrendingUp className='h-5 w-5' />
                                    </div>
                                    <div>
                                        <p className='font-semibold'>{booking.slots.lot.name}</p>
                                        <p className='text-xs text-muted-foreground'>{booking.user.name} • {booking.vehicle.vehicle_number} • Slot {booking.slots.slot_number}
                                        </p>
                                    </div>
                                </div>

                                <div className='text-right'>
                                    <p className='font-black text-emerald-500 flex items-center justify-end text-lg'>+<IndianRupee className='h-4 w-4' />{booking.total_price}</p>
                                    <p className='text-xs text-muted-foreground uppercase tracking-widest'>{format(new Date(booking.booking_start), "MMM dd, hh:mm a")}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
