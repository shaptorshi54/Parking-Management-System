"use client"

import DriverSidebar from '@/app/components/DriverSidebar'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import React from 'react'

export default function page() {
  return (
    <div>
      <div>
      </div>
      {/* <Button onClick={() => signOut({ callbackUrl: '/login' })}>Logout</Button> */}
    </div>
  )
}
