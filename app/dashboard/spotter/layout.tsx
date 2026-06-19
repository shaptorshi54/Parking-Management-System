import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import DriverSidebar from "@/app/components/DriverSidebar";

export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <DriverSidebar user={session?.user} />
      <SidebarInset className="bg-background/50 p-4 md:p-5">
        {children}
      </SidebarInset>
    </>
  );
}
