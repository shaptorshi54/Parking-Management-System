import { Car, Star, Shield, Clock, Zap, Eye, Accessibility, Umbrella, MapPin, ArrowLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Placeholder data — later this will come from your database via Prisma
const lot = {
  name: "Central Park Tower Garage",
  address: "1 Central Park West, New York, NY 10019",
  rating: 4.7,
  reviews: 284,
  pricePerHour: 4.5,
  spotsAvailable: 42,
  totalSpots: 180,
  description:
    "A premium multi-level parking facility located steps away from Central Park. Featuring modern EV charging stations, 24/7 CCTV surveillance, and handicap-accessible spaces on every floor. Our valet service ensures your vehicle is handled with care.",
  images: [
    "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1611174275735-a0b26e8e06cd?w=600&h=400&fit=crop",
  ],
  amenities: [
    { icon: Eye, label: "CCTV" },
    { icon: Zap, label: "EV Charging" },
    { icon: Accessibility, label: "Accessible" },
    { icon: Umbrella, label: "Covered" },
    { icon: Shield, label: "24/7 Security" },
    { icon: Car, label: "Valet" },
  ],
  hours: "Open 24 hours",
};

export default async function ParkingLotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen">
      {/* ─── Back Navigation ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Results
        </Link>
      </div>

      {/* ─── Image Gallery ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[280px] sm:h-[360px]">
          {/* Main Image */}
          <div className="md:col-span-2 md:row-span-2 relative">
            <img
              src={lot.images[0]}
              alt={lot.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          {/* Side Images */}
          <div className="hidden md:block relative">
            <img
              src={lot.images[1]}
              alt="Interior view"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden md:block relative">
            <img
              src={lot.images[2]}
              alt="Facility view"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ─── Content Grid ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ─── Left Column: Details ─── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Title Block */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-primary/15 text-primary border-primary/25 text-[10px] uppercase tracking-wider font-semibold px-3 py-1 hover:bg-primary/15">
                  <Clock className="h-3 w-3 mr-1.5" />
                  {lot.hours}
                </Badge>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-[10px] uppercase tracking-wider font-semibold px-3 py-1 hover:bg-emerald-500/15">
                  <Zap className="h-3 w-3 mr-1.5" />
                  EV Charging
                </Badge>
              </div>

              <h1 className="font-fraunces text-3xl sm:text-4xl font-medium tracking-tight">
                {lot.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm text-muted-foreground">{lot.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(lot.rating)
                            ? "text-primary fill-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{lot.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({lot.reviews} reviews)
                  </span>
                </div>

                <div className="h-4 w-px bg-border" />

                {/* Availability */}
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <span className="text-emerald-400 font-medium">{lot.spotsAvailable}</span> spots available
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Description */}
            <div>
              <h2 className="text-[11px] uppercase tracking-wider text-primary font-semibold mb-4">
                About This Location
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lot.description}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Amenities */}
            <div>
              <h2 className="text-[11px] uppercase tracking-wider text-primary font-semibold mb-6">
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {lot.amenities.map((amenity) => (
                  <div
                    key={amenity.label}
                    className="glass-panel flex items-center gap-3 p-4 rounded-xl border-accent-subtle transition-colors hover:bg-primary/5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <amenity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Capacity */}
            <div>
              <h2 className="text-[11px] uppercase tracking-wider text-primary font-semibold mb-4">
                Capacity
              </h2>
              <div className="flex items-center gap-6">
                <div className="glass-panel p-5 rounded-xl flex-1 text-center border-accent-subtle">
                  <p className="font-fraunces text-2xl font-medium text-primary">{lot.totalSpots}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Total Spots</p>
                </div>
                <div className="glass-panel p-5 rounded-xl flex-1 text-center border-accent-subtle">
                  <p className="font-fraunces text-2xl font-medium text-emerald-400">{lot.spotsAvailable}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Available Now</p>
                </div>
                <div className="glass-panel p-5 rounded-xl flex-1 text-center border-accent-subtle">
                  <p className="font-fraunces text-2xl font-medium">{Math.round((lot.spotsAvailable / lot.totalSpots) * 100)}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Availability</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Column: Booking Card ─── */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="glass-panel rounded-2xl p-6 border-accent-subtle glow-orange space-y-6">

                {/* Price Header */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-fraunces text-3xl font-medium">${lot.pricePerHour.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground ml-1">/hr</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                    <span className="text-sm font-medium">{lot.rating}</span>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Date/Time Inputs */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
                        Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full h-10 rounded-lg bg-background/50 border border-border px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        className="w-full h-10 rounded-lg bg-background/50 border border-border px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
                        Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full h-10 rounded-lg bg-background/50 border border-border px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        className="w-full h-10 rounded-lg bg-background/50 border border-border px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Type */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
                    Vehicle Type
                  </label>
                  <select className="w-full h-10 rounded-lg bg-background/50 border border-border px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer">
                    <option>Sedan / Hatchback</option>
                    <option>SUV / Crossover</option>
                    <option>Truck / Van</option>
                    <option>Motorcycle</option>
                  </select>
                </div>

                <div className="h-px bg-border" />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>$4.50 × 3 hrs</span>
                    <span>$13.50</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Service fee</span>
                    <span>$1.50</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">$15.00</span>
                  </div>
                </div>

                {/* Reserve Button */}
                <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] uppercase tracking-wider font-semibold rounded-xl gap-2 cursor-pointer transition-all">
                  Reserve This Spot
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>

                <p className="text-[10px] text-center text-muted-foreground">
                  You won&apos;t be charged yet
                </p>
              </div>

              {/* Quick Info Below Card */}
              <div className="mt-4 glass-panel rounded-xl p-4 flex items-center gap-3 border-accent-subtle">
                <Users className="h-4 w-4 text-primary shrink-0" />
                <p className="text-[11px] text-muted-foreground">
                  <span className="text-foreground font-medium">12 people</span> booked this lot in the last 24 hours
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
