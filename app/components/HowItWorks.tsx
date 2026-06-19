import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  {
    id: "01",
    title: "Search",
    desc: "Enter your destination and browse nearby parking lots with real-time availability.",
    icon: (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  },
  {
    id: "02",
    title: "Book",
    desc: "Choose your preferred spot, vehicle type, and time window. Confirm in one tap.",
    icon: (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
  },
  {
    id: "03",
    title: "Park",
    desc: "Get instant directions to your reserved spot. No circling, no stress.",
    icon: (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>
  },
  {
    id: "04",
    title: "Done",
    desc: "Pay securely online. Rate your experience and build your booking history.",
    icon: (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 relative z-10 bg-background/50">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-2 w-2 bg-primary rounded-sm"></div>
          <h2 className="text-[11px] uppercase tracking-widest text-primary font-semibold">How It Works</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.id}
                className="bg-card border-none rounded-xl overflow-hidden min-h-[220px]"
              >
                <CardContent className="p-6 flex flex-col h-full relative">
                  <div className="absolute top-6 right-6 text-primary/20">
                    <Icon className="h-16 w-16" />
                  </div>
                  
                  <div className="text-primary font-mono text-sm mb-8">{step.id}</div>
                  
                  <div className="mt-auto z-10">
                    <h3 className="font-fraunces text-xl font-medium tracking-tight mb-2">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
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
