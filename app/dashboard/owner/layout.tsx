import { OwnerSidebar } from "../../components/OwnerSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/auth";

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
      <OwnerSidebar user={dbUser} />
      <SidebarInset className="bg-background/50 p-4 md:p-5">
        {children}
      </SidebarInset>
    </>
  );
}
