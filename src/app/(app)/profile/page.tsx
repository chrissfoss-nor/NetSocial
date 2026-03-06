import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      image: true,
      createdAt: true,
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });

  if (!user) redirect("/login");

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const displayName = user.name || user.username;
  const joined = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
    new Date(user.createdAt)
  );

  return (
    <div className="space-y-5">
      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl flex-shrink-0">
            {displayName[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
                <p className="text-sm text-gray-400">@{user.username}</p>
              </div>
              <button className="text-sm border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
                Edit profile
              </button>
            </div>
            {user.bio && (
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{user.bio}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">Joined {joined}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 mt-5 pt-4">
          <div className="text-center">
            <p className="font-bold text-gray-900">{user._count.posts}</p>
            <p className="text-xs text-gray-400 mt-0.5">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">{user._count.followers}</p>
            <p className="text-xs text-gray-400 mt-0.5">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">{user._count.following}</p>
            <p className="text-xs text-gray-400 mt-0.5">Following</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-1">
        Posts
      </h2>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-400 text-sm">
          No posts yet.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={user.id} />
          ))}
        </div>
      )}
    </div>
  );
}
