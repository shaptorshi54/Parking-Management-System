"use client"

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})


export default function ParkingMap({ lots }: { lots: any[] }) {
    const validLots = lots && lots.length > 0 ? lots.filter(
        (lot) => typeof lot.location_latitude === 'number' && typeof lot.location_longitude === 'number'
    ) : [];

    const centerLat = validLots.length > 0 ? validLots[0].location_latitude : 22.5726;
    const centerLng = validLots.length > 0 ? validLots[0].location_longitude : 88.3639;
    const defaultCenter: [number, number] = [centerLat,centerLng]

    return (
        <div className="h-[500px] w-full rounded-xl overflow-hidden border border-border shadow-sm z-0 relative">
            <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>">' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {validLots.map((lot) => (
                    <Marker key={lot.id} position={[lot.location_latitude, lot.location_longitude]}>
                        <Popup>
                            <div>
                                <strong>{lot.name}</strong>
                                <span>{lot.pricePerHour}</span>
                                <Link href={`/dashboard/spotter/lots/${lot.id}`}>
                                <Button size={`sm`}>Book Now</Button>
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
