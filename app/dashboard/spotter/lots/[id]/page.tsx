import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, IndianRupee, Clock, Car } from "lucide-react";
import BookingCheckoutForm from "@/app/components/BookingCheckoutForm";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const resolvedParams = await params;
  const lotId = resolvedParams.id;

  // 1. Fetch the Parking Lot details
  const lot = await prisma.parking_Lots.findUnique({
    where: { id:lotId },
    include: { slots: true }
  });

  if (!lot) return notFound();

  // 2. Fetch the User's saved Vehicles
  const userVehicles = await prisma.vehicles.findMany({
    where: { user_id: session.user.id }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Complete your booking</h1>
        <p className="text-muted-foreground">Review details and secure your parking spot</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Lot Details */}
        <div className="space-y-6">
          <div className="rounded-xl overflow-hidden border border-border shadow-sm h-[200px] bg-muted flex items-center justify-center">
            {/* Placeholder for lot image, since images[] might be empty */}
            <Car className="h-16 w-16 text-muted-foreground opacity-50" />
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{lot.name}</h2>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" /> {lot.address}
              </p>
            </div>
            
            <div className="flex items-center gap-4 border-y border-border py-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rate</p>
                  <p className="font-bold">₹{lot.pricePerHour}/hr</p>
                </div>
              </div>
              <div className="w-px h-10 bg-border"></div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Access</p>
                  <p className="font-bold">{lot.is_24_7 ? "24/7" : "Limited"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {lot.amenities.map(amenity => (
                  <span key={amenity} className="text-xs bg-muted px-2 py-1 rounded-md">{amenity}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{lot.description || "A premium parking facility."}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Interactive Booking Form */}
        <div>
          <BookingCheckoutForm lot={lot} userVehicles={userVehicles} userId={session.user.id} />
        </div>

      </div>
    </div>
  );
}
