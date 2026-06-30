import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import DriverSidebar from "@/app/components/DriverSidebar";

export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const dbUser = session?.user?.id 
    ? await import("@/lib/prisma").then(m => m.prisma.users.findUnique({ where: { id: session.user.id } })) 
    : session?.user;

  return (
    <>
      <DriverSidebar user={dbUser} />
      <SidebarInset className="bg-background/50 p-4 md:p-5">
        {children}
      </SidebarInset>
    </>
  );
}
