import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Car, Clock, IndianRupee, ShieldCheck, Zap, Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import Link from "next/link";

export default async function MyLotsPage() {
  const session = await auth();
  
  // Fetch the owner's lots along with their slots
  const myLots = await prisma.parking_Lots.findMany({
    where: { owner_id: session?.user?.id },
    include: { slots: true },
    orderBy: { createdAt: "desc" }
  });

  // Calculate top-level stats
  const totalLots = myLots.length;
  const totalSlots = myLots.reduce((acc, lot) => acc + lot.slots.length, 0);
  const occupiedSlots = myLots.reduce((acc, lot) => acc + lot.slots.filter(s => s.status === "OCCUPIED").length, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* =========================================
          SECTION 1: PAGE HEADER & STATS ROW
          ========================================= */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My lots</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {totalLots} properties · last updated just now
            </p>
          </div>
          <Link href="/dashboard/owner/create-lot">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create new lot
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card shadow-sm border-border">
            <CardContent className="p-4 flex flex-col justify-center">
              <p className="text-sm text-muted-foreground font-medium">Total lots</p>
              <p className="text-2xl font-bold mt-1">{totalLots}</p>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm border-border">
            <CardContent className="p-4 flex flex-col justify-center">
              <p className="text-sm text-muted-foreground font-medium">Total slots</p>
              <p className="text-2xl font-bold mt-1">{totalSlots}</p>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm border-border">
            <CardContent className="p-4 flex flex-col justify-center">
              <p className="text-sm text-muted-foreground font-medium">Occupied now</p>
              <p className="text-2xl font-bold mt-1">{occupiedSlots}</p>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm border-border">
            <CardContent className="p-4 flex flex-col justify-center">
              <p className="text-sm text-muted-foreground font-medium">Revenue today</p>
              <p className="text-2xl font-bold mt-1">₹0</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* =========================================
          SECTION 2: SEARCH & FILTERS
          ========================================= */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground " />
          <Input placeholder="Search by lot name or address..." className="pl-9 bg-card border-border" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Button variant="secondary" className="bg-muted">All</Button>
          <Button variant="outline" className="gap-2 border-border"><Filter className="h-4 w-4"/> Published</Button>
          <Button variant="outline" className="gap-2 border-border"><Filter className="h-4 w-4"/> Draft</Button>
          <Button variant="outline" className="gap-2 border-border ml-auto"><ArrowUpDown className="h-4 w-4"/> Sort</Button>
        </div>
      </div>

      {/* =========================================
          SECTION 3: LIST OF PARKING LOT CARDS
          ========================================= */}
      <div className="space-y-4">
        {myLots.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">You don't have any lots yet.</div>
        ) : (
          myLots.map((lot) => {
            const lotOccupied = lot.slots.filter(s => s.status === "OCCUPIED").length;
            const occupancyRate = lot.slots.length > 0 ? Math.round((lotOccupied / lot.slots.length) * 100) : 0;
            const is247Str = lot.is_24_7 ? "24/7" : "Limited hours";

            return (
              <Card key={lot.id} className="flex flex-row overflow-hidden shadow-sm hover:border-primary/50 transition-colors bg-card p-0">
                
                {/* 3A. Left Accent Column */}
                <div className="w-12 sm:w-16 bg-blue-500/10 flex items-center justify-center border-r border-border shrink-0">
                  <Car className="h-5 w-5 text-blue-500 opacity-60" />
                </div>

                {/* 3B. Middle Content Column */}
                <div className="flex-1 flex flex-col justify-center py-2 min-w-0">
                  <CardHeader className="pb-1 pt-3 px-4 sm:px-5">
                    <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                      <CardTitle className="text-lg sm:text-xl font-bold tracking-tight truncate w-full">{lot.name}</CardTitle>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shrink-0">
                        Published
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-1">
                      <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{lot.address}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 sm:px-5 pb-3 pt-1 space-y-2.5">
                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center"><Car className="mr-1.5 h-3.5 w-3.5" /> <strong className="text-foreground mr-1">{lot.slots.length}</strong> slots</div>
                      <div className="flex items-center"><IndianRupee className="mr-1 h-3.5 w-3.5" /> <strong className="text-foreground mr-1">{lot.pricePerHour}</strong> /hr</div>
                      <div className="flex items-center"><Clock className="mr-1.5 h-3.5 w-3.5" /> {is247Str}</div>
                      <div className="flex items-center">{occupancyRate}% occupied</div>
                    </div>
                    
                    {/* Amenities Row */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:flex">
                      {lot.amenities.map(amenity => (
                        <Badge key={amenity} variant="secondary" className="bg-muted/50 font-normal text-xs py-0">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </div>

                {/* 3C. Right Action Column */}
                <CardFooter className="flex-col gap-1.5 p-3 sm:p-4 border-l border-border bg-muted/5 justify-center items-stretch shrink-0 m-0 w-24 sm:w-32">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs sm:text-sm h-8">
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs sm:text-sm h-8">
                    Edit
                  </Button>
                  <Link href={`/dashboard/owner/lots/${lot.id}`} className="w-full block">
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs sm:text-sm h-8">
                      Slots
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* =========================================
          SECTION 4: "ADD ANOTHER LOT" GHOST CARD
          ========================================= */}
      <Link href="/dashboard/owner/create-lot" className="block">
        <div className="w-full border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors cursor-pointer gap-2">
          <Plus className="h-8 w-8 opacity-50" />
          <h3 className="font-medium text-lg">Add another lot</h3>
          <p className="text-sm opacity-70">Create a new parking lot to list it on ParkEase</p>
        </div>
      </Link>

    </div>
  );
}
