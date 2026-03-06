import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import SignOutButton from "@/components/SignOutButton";

const SETTINGS = [
  { label: "Privacy & Security" },
  { label: "Notifications" },
  { label: "Appearance" },
  { label: "Change Password" },
  { label: "Help & Support" },
];

export default async function MePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
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
  const initial = displayName[0].toUpperCase();
  const joined = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Unique header — no sidebar on this page */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between gap-6">
          {/* Logo */}
          <span className="text-sm font-bold text-gray-900 flex-shrink-0">NetSocial</span>

          {/* Nav links */}
          <nav className="flex items-center gap-1 flex-1">
            {[
              { href: "/feed", label: "Feed" },
              { href: "/compose", label: "New Post" },
              { href: "/meet", label: "Meet Friends" },
              { href: "/search", label: "Search" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Sign out */}
          <SignOutButton />
        </div>
      </header>

      {/* Dark profile banner */}
      <div className="h-32 bg-gray-900" />

      <div className="max-w-5xl mx-auto px-6">

        {/* Profile header */}
        <div className="-mt-10 mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-lg bg-white border-4 border-white shadow-sm flex items-center justify-center text-gray-900 font-bold text-2xl flex-shrink-0">
              {initial}
            </div>
            <div className="pb-1">
              <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                @{user.username}
                <span className="mx-2 text-gray-300">·</span>
                Joined {joined}
              </p>
              {user.bio && (
                <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
              )}
            </div>
          </div>
          <div className="pb-1">
            <button className="text-xs font-semibold border border-gray-200 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-8 border-b border-gray-200 pb-6">
          {[
            { label: "Posts", value: user._count.posts },
            { label: "Followers", value: user._count.followers },
            { label: "Following", value: user._count.following },
          ].map((stat) => (
            <div key={stat.label}>
              <span className="text-lg font-bold text-gray-900">{stat.value}</span>
              <span className="text-sm text-gray-400 ml-1.5">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 pb-14">

          {/* Left: Settings */}
          <aside className="space-y-px lg:sticky lg:top-16 self-start">

            {/* Account info */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h2>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: "Name", value: user.name || "—" },
                  { label: "Username", value: `@${user.username}` },
                  { label: "Email", value: user.email },
                  ...(user.bio ? [{ label: "Bio", value: user.bio }] : []),
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-xs text-gray-400 mb-0.5">{row.label}</p>
                    <p className="text-sm text-gray-800">{row.value}</p>
                  </div>
                ))}
                <button className="w-full mt-2 text-xs font-semibold border border-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</h2>
              </div>
              <ul className="divide-y divide-gray-50">
                {SETTINGS.map((item) => (
                  <li key={item.label}>
                    <button className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group">
                      {item.label}
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-gray-300 group-hover:text-gray-500 transition-colors">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sign out */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <SignOutButton full />
            </div>

          </aside>

          {/* Right: Posts */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Posts <span className="text-gray-400 font-normal">({posts.length})</span>
              </h2>
              <Link
                href="/compose"
                className="text-xs font-semibold text-gray-700 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
              >
                + New Post
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-sm font-medium text-gray-900 mb-1">No posts yet</p>
                <p className="text-xs text-gray-400 mb-4">Share what&apos;s on your mind</p>
                <Link
                  href="/compose"
                  className="inline-block bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Write your first post
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} currentUserId={user.id} />
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
