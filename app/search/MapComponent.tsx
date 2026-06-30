"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, IndianRupee, MapPin } from "lucide-react";
import LocationSearchBar from "../components/LocationSearchBar";
import { useSearchParams } from "next/navigation";

// Fix for Leaflet's default icon missing issue in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({ lat, lon }: { lat: number, lon: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lon], 14)
  }, [lat, lon, map])
  return null
}

export default function MapComponent({ lat, lon, lots }: { lat: number, lon: number, lots: any[] }) {
  const searchParams = useSearchParams();
  
  // 1. Safely parse URL coordinates, fallback to defaults if URL is corrupted
  let activeLat = Number(searchParams.get("lat"));
  if (isNaN(activeLat) || activeLat === 0) activeLat = lat || 22.5726;

  let activeLon = Number(searchParams.get("lon"));
  if (isNaN(activeLon) || activeLon === 0) activeLon = lon || 88.3639;

  // 2. Filter out corrupted database records that don't have GPS coordinates!
  const validLots = lots.filter(
    (lot) => typeof lot.location_latitude === 'number' && typeof lot.location_longitude === 'number'
  );

  return (
    <div className="relative h-full w-full">

      {/* Floating UI Overlay */}
      <div className="absolute top-4 left-0 w-full z-9999 px-4 pointer-events-none flex flex-col gap-4 items-start">
        <Link href={`/dashboard/spotter/search`} className="pointer-events-auto">
          <Button>
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>

        <div className="w-full pointer-events-auto">
          <div>
            <LocationSearchBar />
          </div>
        </div>
      </div>
      <MapContainer
        center={[activeLat, activeLon]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater lat={activeLat} lon={activeLon} />

        {/* The user's searched location pin */}
        <Marker position={[activeLat, activeLon]} icon={customIcon}>
            <Popup>You searched near here!</Popup>
        </Marker>

        {/* Real Parking Lots */}
        {validLots.map((lot) => (
          <Marker position={[lot.location_latitude, lot.location_longitude]} icon={customIcon} key={lot.id}>
            <Popup className="premium-popup">
              <div className="flex flex-col gap-1 p-1 min-w-[180px]">
                <strong className="text-lg font-bold leading-tight">{lot.name}</strong>
                <p className="text-muted-foreground text-xs flex items-center mb-2"><MapPin className="h-3 w-3 mr-1" />{lot.address}</p>
                <div className="flex justify-between items-center mb-3 p-2 bg-muted/20 rounded-lg">
                  <span className="text-xs text-muted-foreground">Rate:</span>
                  <span className="font-bold text-primary flex items-center text-sm">
                    <IndianRupee className="h-3 w-3"/>{lot.pricePerHour}/hr
                  </span>
                </div>
                <Link href={`/dashboard/spotter/lots/${lot.id}`} className="w-full">
                  <Button size="sm" className="w-full font-bold shadow-sm">
                    Book Spot
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
