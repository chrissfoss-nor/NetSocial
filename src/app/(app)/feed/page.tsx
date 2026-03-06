import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Feed from "@/components/Feed";

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Home Feed</h1>
      <Feed userId={session.user.id} />
    </div>
  );
}
