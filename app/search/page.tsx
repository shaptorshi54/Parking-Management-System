
import { prisma } from '@/lib/prisma'
import MapWrapper from './MapWrapper'


export default async function page({ searchParams }: { searchParams: { lat?: string, lon?: string } }) {
    const lat = Number(searchParams.lat) || 40.7128
    const lon = Number(searchParams.lon) || -74.0060

    const lots = await prisma.parking_Lots.findMany()
    return (
        <div className="flex h-screen w-full flex-col">
            <MapWrapper lat={lat} lon={lon} lots={lots}/>
        </div>
    )
}
