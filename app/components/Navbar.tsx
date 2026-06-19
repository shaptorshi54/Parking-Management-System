import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full pt-4 px-4 sm:px-6">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 rounded-2xl glass-panel">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-transparent border border-primary/50 text-primary transition-transform group-hover:scale-105">
            <Car className="h-4 w-4" />
          </div>
          <span className="font-fraunces text-sm font-medium tracking-widest uppercase">
            Park<span className="text-primary">Ease</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="#search" className="text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
            Find Parking
          </Link>
          <Link href="#featured" className="text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
            Locations
          </Link>
          <Link href="#how-it-works" className="text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
        </div>

        {/* CTA Button */}
        <div className="flex items-center">
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] uppercase tracking-wider font-semibold rounded-md h-9 px-5 gap-2"
            asChild
          >
            <Link href="/register">
              Book Now <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
