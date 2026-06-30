import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/app/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const user = await prisma.users.findUnique({ where: { id: session.user.id } });
  if (!user) return <div>User not found</div>;

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information.</p>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}
