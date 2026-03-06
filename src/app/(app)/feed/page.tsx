import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Feed from "@/components/Feed";

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return <Feed userId={session.user.id} />;
}
