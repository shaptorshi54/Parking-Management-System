import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const FEATURED_LOTS = [
  {
    id: 1,
    name: "Central Mall",
    desc: "Premium spots in the heart of Park Street.",
    location: "Kolkata",
    icon: (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
  },
  {
    id: 2,
    name: "Tech Park",
    desc: "24/7 access with dedicated security.",
    location: "Sector V",
    icon: (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
  },
  {
    id: 3,
    name: "City Centre",
    desc: "Valet services available on weekends.",
    location: "Rajarhat",
    icon: (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
  },
  {
    id: 4,
    name: "Airport P1",
    desc: "Long term parking with shuttle service.",
    location: "Dum Dum",
    icon: (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 8l6.4 3.3L5 15 2 15.5 3 17l4-1 1.5-1.5L15 19.5l1.2-1.2c.4-.2.7-.6.6-1.1z"></path></svg>
  }
];

export default function FeaturedLots() {
  return (
    <section id="featured" className="px-6 py-24 relative z-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-2 w-2 bg-primary rounded-sm"></div>
          <h2 className="text-[11px] uppercase tracking-widest text-primary font-semibold">Our Locations</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {FEATURED_LOTS.map((lot) => {
            const Icon = lot.icon;
            return (
              <Card
                key={lot.id}
                className="group bg-card border-border/50 hover:border-primary/50 transition-colors duration-300 rounded-xl overflow-hidden flex flex-col justify-between min-h-[220px]"
              >
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-fraunces text-2xl font-medium tracking-tight">
                      {lot.name}
                      <br />
                      <span className="text-muted-foreground">{lot.location}</span>
                    </h3>
                    <div className="text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                      <Icon />
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-8 flex items-end justify-between">
                    <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
                      {lot.desc}
                    </p>
                    <Link href={`#`} className="h-8 w-8 rounded-full border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
