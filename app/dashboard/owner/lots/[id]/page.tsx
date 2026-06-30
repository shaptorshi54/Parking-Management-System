import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateSlotStatus } from "@/app/actions/slot-actions";
import {
    MapPin, Clock, IndianRupee, ShieldCheck, Zap,
    Settings, PenSquare, LayoutDashboard, EyeOff, Navigation, Info, Car, Bike
} from "lucide-react";
import { Dialog, DialogTitle, DialogTrigger, DialogHeader, DialogContent, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Link from 'next/link';
import SlotDialogBox from '@/app/components/SlotDialogBox'

interface Slot {
  id: string;
  lot_id: string;
  slot_number: number;
  slot_type: any;
  status: any;
}
export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const resolvedParams = await params;

    const lot = await prisma.parking_Lots.findUnique({
        where: {
            id: resolvedParams.id
        },
        include: {
            slots: {
                orderBy: { slot_number: 'asc' }
            }
        }
    });

    if (!lot) {
        notFound();
    }
    // Calculations
    const carSlots = lot.slots.filter((s: { slot_type: string }) => s.slot_type === 'CAR');
    const bikeSlots = lot.slots.filter((s: { slot_type: string }) => s.slot_type === 'BIKE');
    const mpvSlots = lot.slots.filter((s: { slot_type: string }) => s.slot_type === 'MPV');

    const totalSlots = lot.slots.length;
    const occupiedSlots = lot.slots.filter((s: { status: string }) => s.status === 'OCCUPIED').length;
    const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

    const is247Str = lot.is_24_7 ? "Open 24/7" : "Limited Hours";

    // Reusable Status Badge Component
    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'AVAILABLE': return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Free</Badge>;
            case 'OCCUPIED': return <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/20">Occupied</Badge>;
            case 'MAINTENANCE': return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Maintenance</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 font-jetBrains">

            {/* =========================================
            HEADER & ACTIONS
            ========================================= */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Link href="/dashboard/owner/lots" className="hover:text-foreground transition-colors">My lots</Link>
                    <span>/</span>
                    <span className="text-foreground">{lot.name}</span>
                </div>

                {/* Banner Area (Mock Image Background) */}
                <div className="h-32 rounded-xl bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-border flex items-end justify-end p-4">
                    <Button variant="secondary" size="sm" className="bg-background/50 backdrop-blur-md">3 photos</Button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight font-fraunces">{lot.name}</h1>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Published</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="mr-1.5 h-4 w-4" />
                            {lot.address}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 bg-card"><PenSquare className="h-4 w-4" /> Edit details</Button>
                        <Button variant="outline" size="sm" className="gap-2 bg-card"><LayoutDashboard className="h-4 w-4" /> Manage slots</Button>
                        <Button variant="outline" size="sm" className="gap-2 bg-card"><IndianRupee className="h-4 w-4" /> Revenue</Button>
                        <Button variant="outline" size="sm" className="gap-2 bg-card"><EyeOff className="h-4 w-4" /> Unpublish</Button>
                    </div>
                </div>
            </div>

            {/* =========================================
            TOP STATS ROW
            ========================================= */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card/50">
                    <CardContent className="p-4 space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total slots</p>
                        <p className="text-2xl font-bold">{totalSlots}</p>
                        <p className="text-xs text-muted-foreground">Car {carSlots.length} · Bike {bikeSlots.length} · MPV {mpvSlots.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50">
                    <CardContent className="p-4 space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Occupied now</p>
                        <p className="text-2xl font-bold">{occupiedSlots}</p>
                        <p className="text-xs text-muted-foreground">{occupancyRate}% occupancy</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50">
                    <CardContent className="p-4 space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Revenue today</p>
                        <p className="text-2xl font-bold">₹0</p>
                        <p className="text-xs text-muted-foreground">0 transactions</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50">
                    <CardContent className="p-4 space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Avg. rating</p>
                        <p className="text-2xl font-bold">{lot.rating}</p>
                        <p className="text-xs text-muted-foreground">from {lot.reviewCount} reviews</p>
                    </CardContent>
                </Card>
            </div>

            {/* =========================================
            MAIN GRID (LEFT: DETAILS & MAP, RIGHT: BREAKDOWNS)
            ========================================= */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT COLUMN (Wider) */}
                <div className="xl:col-span-2 space-y-6">

                    {/* LOT DETAILS */}
                    <Card className="bg-card/50">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-border/50">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2"><Info className="h-4 w-4" /> Lot details</CardTitle>
                            <span className="text-xs text-blue-500 cursor-pointer hover:underline">Edit</span>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 bg-muted rounded-md"><MapPin className="h-4 w-4 text-muted-foreground" /></div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Address</p>
                                    <p className="text-sm font-medium">{lot.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 bg-muted rounded-md"><Navigation className="h-4 w-4 text-muted-foreground" /></div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Coordinates</p>
                                    <p className="text-sm font-medium">{lot.location_latitude}° N, {lot.location_longitude}° E</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 bg-muted rounded-md"><IndianRupee className="h-4 w-4 text-muted-foreground" /></div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Base rate</p>
                                    <p className="text-sm font-medium">₹{lot.pricePerHour} / hour</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 bg-muted rounded-md"><Clock className="h-4 w-4 text-muted-foreground" /></div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Operating hours</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{is247Str}</p>
                                        {lot.is_24_7 && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 text-[10px] py-0 border-emerald-500/20">Always open</Badge>}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-border/50">
                                <p className="text-xs text-muted-foreground mb-1">Description</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{lot.description || "No description provided."}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AMENITIES */}
                    <Card className="bg-card/50">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-border/50">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2"><Zap className="h-4 w-4" /> Amenities</CardTitle>
                            <span className="text-xs text-blue-500 cursor-pointer hover:underline">Edit</span>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-wrap gap-2">
                            {lot.amenities.length > 0 ? lot.amenities.map((am: string) => (
                                <Badge key={am} variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/20 py-1 px-3 font-normal gap-1.5">
                                    <ShieldCheck className="h-3 w-3" /> {am}
                                </Badge>
                            )) : <p className="text-sm text-muted-foreground">No amenities listed.</p>}
                        </CardContent>
                    </Card>

                    {/* LIVE SLOT MAP */}
                    <Card className="bg-card/50 border-primary/20">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-border/50">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Live slot map — Level 1</CardTitle>
                            <div className="flex gap-1">
                                <Badge variant="secondary" className="cursor-pointer hover:bg-muted font-normal">L1</Badge>
                                <Badge variant="outline" className="cursor-pointer hover:bg-muted font-normal text-muted-foreground">Roof</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">

                            {/* Legend */}
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-500/20 border border-emerald-500/50 rounded-sm"></div> Free</div>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-500/20 border border-slate-500/50 rounded-sm"></div> Occupied</div>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-500/20 border border-red-500/50 rounded-sm"></div> Maint.</div>
                            </div>

                            {/* Zone Container */}
                            <div className="flex flex-col sm:flex-row gap-6">

                                {/* ZONE A - CARS */}
                                <div className="flex-1 border border-border/50 rounded-lg p-3 bg-muted/5">
                                    <p className="text-xs text-muted-foreground mb-3 text-center">Zone A — Car</p>
                                    <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {carSlots.map((slot: Slot) => (
                                            <SlotDialogBox key={slot.id} slot={slot} lotId={lot.id} />
                                        ))}
                                    </div>
                                </div>

                                {/* ZONE B - BIKES */}
                                <div className="flex-1 border border-border/50 rounded-lg p-3 bg-muted/5">
                                    <p className="text-xs text-muted-foreground mb-3 text-center">Zone B — Bike</p>
                                    <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {bikeSlots.map((slot: Slot) => (
                                            <SlotDialogBox key={slot.id} slot={slot} lotId={lot.id} />
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN (Narrower) */}
                <div className="space-y-6">

                    {/* SLOT BREAKDOWN */}
                    <Card className="bg-card/50">
                        <CardHeader className="p-4 pb-2 border-b border-border/50">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Slot breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">Occupancy</span>
                                    <span className="font-bold">{occupancyRate}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex">
                                    <div className="bg-blue-500 h-full" style={{ width: `${occupancyRate}%` }}></div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground w-12">Car</span>
                                    <div className="flex-1 mx-3 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full w-0"></div>
                                    </div>
                                    <span className="font-medium">0/{carSlots.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground w-12">Bike</span>
                                    <div className="flex-1 mx-3 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full w-0"></div>
                                    </div>
                                    <span className="font-medium">0/{bikeSlots.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground w-12">MPV</span>
                                    <div className="flex-1 mx-3 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className="bg-amber-500 h-full w-0"></div>
                                    </div>
                                    <span className="font-medium">0/{mpvSlots.length}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* RECENT BOOKINGS */}
                    <Card className="bg-card/50">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-border/50">
                            <CardTitle className="text-sm font-semibold">Recent bookings</CardTitle>
                            <span className="text-xs text-blue-500 cursor-pointer hover:underline">View all</span>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="text-center py-6 text-sm text-muted-foreground">
                                No recent bookings found.
                            </div>
                        </CardContent>
                    </Card>

                    {/* REVENUE SUMMARY */}
                    <Card className="bg-card/50">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-border/50">
                            <CardTitle className="text-sm font-semibold">Revenue summary</CardTitle>
                            <span className="text-xs text-blue-500 cursor-pointer hover:underline">Full report</span>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <p className="text-xs text-muted-foreground">Today</p>
                                    <p className="text-lg font-bold">₹0</p>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <p className="text-xs text-muted-foreground">This week</p>
                                    <p className="text-lg font-bold">₹0</p>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <p className="text-xs text-muted-foreground">This month</p>
                                    <p className="text-lg font-bold">₹0</p>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <p className="text-xs text-muted-foreground">All time</p>
                                    <p className="text-lg font-bold">₹0</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>

        </div>
    )
}
