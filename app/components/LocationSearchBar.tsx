"use client"

import { useState,useEffect } from 'react'
import { Search, MapPin } from "lucide-react";
import { Combobox, ComboboxEmpty, ComboboxContent, ComboboxList, ComboboxInput, ComboboxItem } from "@/components/ui/combobox";
import { toast } from "sonner";
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LocationSearchBar() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<any>(null)

    useEffect(() => {
        if (searchQuery.length < 3) {
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            setIsLoading(true) // 1. Start loading
            try {
                // created one backend proxy to fetch the datas in a better and efficient way
                // No API keys needed, no CORS issues, no browser blocks!
                const url = `/api/search?q=${encodeURIComponent(searchQuery)}`

                const response = await fetch(url)
                const data = await response.json()

                if (Array.isArray(data)) {
                    setResults(data)
                } else {
                    setResults([])
                }
            }
            catch (error) {
                console.log(`Failed to fetch locations: ${error}`)
            }
            finally {
                setIsLoading(false) // 2. Stop loading when done
            }
        }, 1000) // 1-second debounce to be safe with our backend proxy

        return () => clearTimeout(timer)
    }, [searchQuery])
    return (
        <div id="search-form" className="mt-12 w-full max-w-3xl glass-panel p-2 rounded-xl flex flex-col sm:flex-row gap-2 shadow-2xl z-20">
            <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                <Combobox items={results}>
                    <ComboboxInput
                        placeholder="Select a location"
                        className="h-14 bg-transparent border-0 pl-12 text-base focus-visible:ring-0 placeholder:text-muted-foreground/50 rounded-lg"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            if (e.target.value.length >= 3) setIsLoading(true) // Show spinner instantly
                        }}
                    />
                    <ComboboxContent>
                        {isLoading
                            ? (
                                <div className="flex items-center justify-center p-6">
                                    <Spinner className="text-primary size-5" />
                                    <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                                </div>
                            )
                            : results.length === 0 && searchQuery.length >= 3
                                ? (<ComboboxEmpty>No parking locations found</ComboboxEmpty>)
                                : (<ComboboxList>
                                    {results.map((location) => (
                                        <ComboboxItem
                                            key={location.place_id}
                                            value={location.display_name}
                                            className="text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer rounded-lg py-3 px-4 transition-colors"
                                            onPointerDown={() => {
                                                setSearchQuery(location.display_name)
                                                setSelectedLocation(location)
                                            }}
                                        >
                                            {location.display_name}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>)}
                    </ComboboxContent>
                </Combobox>
            </div>
            <Button className="h-14 bg-primary text-primary-foreground hover:bg-primary/90 px-8 uppercase tracking-wider font-semibold rounded-lg shrink-0 group transition-all cursor-pointer" onClick={() => {
                if (selectedLocation) {
                    router.push(`/search?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}`)
                }
                else {
                    toast.error(`Please select a location from the dropdown list!`)
                }
            }}>
                <Search className="mr-2 h-4 w-4" />
                Preview Spots
            </Button>
        </div>
    )
}
