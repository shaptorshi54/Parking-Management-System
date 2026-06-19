"use client";

import { ArrowDown, ArrowRight, Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchBar from './LocationSearchBar'

export default function HeroSection() {
  const router = useRouter()

  

  return (
    <section id="search" className="relative flex min-h-[85vh] flex-col justify-center px-6 py-20">
      <div className="relative z-10 mx-auto max-w-7xl w-full flex flex-col">

        {/* Heading */}
        <h1 className="font-fraunces text-5xl font-medium leading-[1.1] tracking-tight sm:text-6xl lg:text-[5.5rem] uppercase max-w-5xl text-left">
          ParkEase Creates
          <br />
          Value <span className="text-primary inline-flex items-center">→</span> For Drivers
          <br />
          And Lot Owners
        </h1>

        <div className="mt-16 flex flex-col lg:flex-row items-end justify-between gap-12 w-full">
          {/* Interactive Stats/Info Cards */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl opacity-90">
            <div className="glass-panel p-6 flex-1 text-left relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h3 className="text-[11px] uppercase tracking-wider text-primary mb-2 font-semibold">Empowers</h3>
              <p className="text-sm text-muted-foreground">Everyday drivers and commuters</p>
            </div>
            <div className="glass-panel p-6 flex-1 text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h3 className="text-[11px] uppercase tracking-wider text-primary mb-2 font-semibold">Connects</h3>
              <p className="text-sm text-muted-foreground">Lot owners with instant demand</p>
            </div>
          </div>

          {/* Subheading text off to the side (Desktop) */}
          <div className="hidden lg:flex flex-col items-end text-right max-w-[280px]">
            <p className="text-sm text-muted-foreground leading-relaxed border-r-2 border-primary/30 pr-4">
              We harness real-time data to connect you with the best spots. Search availability before you commit.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {/* Scroll indicator - prominent orange circle - centered lower */}
        <div className="mt-24 self-center flex justify-center">
          <Link href="#featured" className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-transform glow-orange shadow-[0_0_40px_rgba(247,147,26,0.3)]">
            <ArrowDown className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}
