import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, ParkingCircle, CarFront, Activity, IndianRupee } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function OwnerOverviewPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "Owner";

  const lots = await prisma.parking_Lots.findMany({
    where: { owner_id: session?.user.id },
    include: { slots: true }
  })

  const lotIds = lots.map((l: { id: string }) => l.id)

  // Dynamic Slots and Lots
  const totalLots = lots.length
  const totalSlots = lots.reduce((acc: number, lot: { slots: unknown[] }) => acc + lot.slots.length, 0)
  const occupiedSlots = lots.reduce((acc: number, lot: { slots: { status: string }[] }) => acc + lot.slots.filter((s: { status: string }) => s.status === "OCCUPIED").length, 0)
  const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0
  const allBookings = await prisma.bookings.findMany({
    where: {
      slots: { lot_id: { in: lotIds } },
    },
    include: { user: true, slots: { include: { lot: true } } },
    orderBy: { booking_start: "desc" }
  })

  const current = new Date().toDateString()
  const currentRevenue = allBookings.filter((b: { status: string, booking_start: Date }) => (b.status === "COMPLETED" || b.status === "CONFIRMED") && new Date(b.booking_start).toDateString() === current).reduce((sum: number, b: { total_price: number }) => sum + b.total_price, 0)
  const recentBookings = allBookings.slice(0, 5)
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Here is what's happening with your parking lots today.
          </p>
        </div>
        <Link href="/dashboard/owner/create-lot">
          <Button className="shadow-lg">
            + Create New Lot
          </Button>
        </Link>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="h-5 w-5" />
              {currentRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From all active lots
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lots</CardTitle>
            <ParkingCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLots}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently managed by you
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
            <CarFront className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSlots}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined Capacity (Cars, Bikes, & MPVs)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Occupancy</CardTitle>
            <Activity className={`h-4 w-4 ${occupancyRate > 80 ? `text-red-500` : `text-amber-500`}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-amber-500 font-medium">{occupiedSlots} out of {totalSlots} </span>spots filled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Recent Activity Feed */}
      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/10 border-b border-border/50 pb-4">
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent bookings found
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {recentBookings.map((booking: { status: string; id: string; user: { name: string }; slots: { slot_number: number; lot: { name: string } } }) => {
                const active = booking.status === "CONFIRMED"
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">

                    {/* Left side */}
                    <div className="flex items-center gap-4"  >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm tracking-wider shadow-inner">
                        {booking.user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div >
                        <p className="font-semibold text-sm">{booking.user.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 ">{booking.slots.lot.name} • Slot {booking.slots.slot_number}</p>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col items-end gap-1.5">
                      {active ? (
                        <Badge variant={`outline`}
                          className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0 h-5 text-[10px] uppercase">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant={`outline`} className="text-muted-foreground border-border h-5 text-[10px] px-2 uppercase tracking-widest">
                          Completed
                        </Badge>
                      )}
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
