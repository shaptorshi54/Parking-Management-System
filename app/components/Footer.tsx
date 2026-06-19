import { Car } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/20 px-6 py-12 relative z-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Brand */}
        <div className="flex items-center gap-3 group opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-primary/50 text-primary">
            <Car className="h-4 w-4" />
          </div>
          <span className="font-fraunces text-sm font-medium tracking-widest uppercase">
            Park<span className="text-primary">Ease</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-8 text-[11px] uppercase tracking-wider text-muted-foreground">
          <Link href="#" className="transition-colors hover:text-foreground">Privacy</Link>
          <Link href="#" className="transition-colors hover:text-foreground">Terms</Link>
          <Link href="#" className="transition-colors hover:text-foreground">Support</Link>
        </div>

        {/* Copyright */}
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">
          © {new Date().getFullYear()} ParkEase
        </p>
      </div>
    </footer>
  );
}
