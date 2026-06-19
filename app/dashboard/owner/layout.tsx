import { OwnerSidebar } from "../../components/OwnerSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/auth";

export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <OwnerSidebar user={session?.user} />
      <SidebarInset className="bg-background/50 p-4 md:p-5">
        {children}
      </SidebarInset>
    </>
  );
}
