"use client"

import React from 'react'
import { useState } from 'react'
import { format } from 'date-fns'
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Car, Clock, Download, IndianRupee, MapPin, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function page({ bookings }: { bookings: any[] }) {
    const [activeTab, setActiveTab] = useState("all")

    const currentDate = new Date()
    const filteredBookings = bookings.filter((b) => {
        const isExpired = new Date(b.booking_end) < currentDate
        if (activeTab === "active") return !isExpired && b.status === "CONFIRMED"
        if (activeTab === "completed") return isExpired && b.status === "COMPLETED"
        return true //for all tab
    })
    return (
        <div className='w-full'>
            <Tabs defaultValue='all' className='w-full mb-8' onValueChange={setActiveTab}>
                <TabsList className='grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl'>
                    <TabsTrigger value='all' className='rounded-lg'>All</TabsTrigger>
                    <TabsTrigger value='active' className='rounded-lg'>Active</TabsTrigger>
                    <TabsTrigger value='completed' className='rounded-lg'>Past</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* bookings for empty and non-empty */}
            <div>
                {filteredBookings.length === 0 ? (
                    <div className='text-center py-10 text-muted-foreground'>
                        No bookings found in this category
                    </div>
                ) : (
                    <Accordion type='single' collapsible className='w-full space-y-4'>

                        {filteredBookings.map((booking) => {
                            const isExpired = new Date(booking.booking_end) < currentDate
                            const statusColor = isExpired ? "bg-muted text-muted-foreground" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        
                            const DotColor = isExpired ? "bg-muted-foreground" : "bg-emerald-500 animate-pulse"
                            return (
                                <div key={booking.id}>
                                    {/* Timeline Dot */}
                                    <div className={`absolute -left-7.75 top-6 h-3 w-3 rounded-full border-2 border-background ${DotColor}`}/>
                                        <AccordionItem value={booking.id}>
                                            <AccordionTrigger className='hover:no-underline'>
                                                <div className='flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 text-left gap-4'>
                                                    <div>
                                                        <p className='text-xs text-muted-foreground mb-1 font-medium tracking-wider uppercase'>{format(new Date(booking.booking_start), "MMM dd, yyyy")}</p>
                                                        <h3 className='text-lg font-bold'>{booking.slots.lot.name}</h3>
                                                        <div className='flex items-center gap-2'>
                                                            <Badge variant={`outline`} className={statusColor}>{isExpired ? "Completed" : "Active"}</Badge>
                                                            <span className='flex items-center text-muted-foreground text-xs'>
                                                                <Clock className='h-3 w-3 mr-1'/>
                                                                {format(new Date(booking.booking_start), "hh:mm a")}
                                                            </span>
                                                        </div>
                                                    </div>
        
                                                    <div className='text-left sm:text-right'>
                                                        <p className='text-xs text-muted-foreground mb-1'>Total Paid</p>
                                                        <p className='font-black text-xl flex items-center sm:justify-end text-primary'>
                                                            <IndianRupee className='h-4 w-4'/>
                                                            {booking.total_price}
                                                        </p>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className='pt-2 pb-4 border-t border-border/50'>
                                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                                                    <div className='space-y-3 bg-muted/20 p-4 rounded-lg'>
                                                        <p className='text-xs text-muted-foreground flex items-center gap-1'>
                                                            <MapPin className='h-4 w-4'/>
                                                            {booking.slots.lot.address}
                                                        </p>
                                                        <p className='text-xs text-muted-foreground flex items-center gap-1'>
                                                            <Car className='h-4 w-4'/>
                                                            {booking.vehicle.vehicle_model} ({booking.vehicle.vehicle_number})
                                                        </p>
                                                        <p className='text-xs text-muted-foreground'>
                                                            <strong>Slot Assigned:</strong>
                                                            {booking.slots.slot_number}
                                                        </p>
                                                    </div>
        
                                                    <div className='flex flex-col justify-end gap-2'>
                                                        <Button variant={`outline`} className='w-full gap-2'>
                                                            <Download className='h-4 w-4'/>
                                                        </Button>
                                                        <Button variant={`secondary`} className='w-full gap-2'>
                                                            <RotateCcw />Book
                                                        </Button>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                </div>
                            )
                        })}
                    </Accordion>
                )}
            </div>
        </div>
    )
}
