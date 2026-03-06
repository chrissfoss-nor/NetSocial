import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import UserSidebar from "@/components/UserSidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, username: true, bio: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: user.name, email: user.email, image: user.image }} />
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6 items-start">
        <aside className="hidden md:block w-60 flex-shrink-0 sticky top-20">
          <UserSidebar user={user} />
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
