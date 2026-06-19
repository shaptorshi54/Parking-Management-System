import React from 'react'
import History from '../../../components/BookingHistoryTimeline'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export default async function page() {
  const session = await auth()
  const bookings = await prisma.bookings.findMany({
    where: {
      user_id: session?.user.id
    },
    include: {
      slots: {
        include: {
          lot: true
        }
      },
      vehicle: true
    },
    orderBy: {
      booking_start: "desc"
    }
  })
  return (
    <div>
      <History bookings={bookings}/>
    </div>
  )
}
