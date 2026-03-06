"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  user: { name?: string | null; email?: string | null; image?: string | null };
};

const NAV = [
  { href: "/feed", label: "Feed" },
  { href: "/compose", label: "New Post" },
  { href: "/meet", label: "Meet Friends" },
  { href: "/search", label: "Search" },
];

export default function Navbar({ user }: Props) {
  const displayName = user.name || user.email || "User";
  const initial = displayName[0].toUpperCase();
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center gap-6">
        {/* Logo */}
        <Link href="/feed" className="text-sm font-bold text-gray-900 flex-shrink-0">
          NetSocial
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === item.href
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User + sign out */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/me"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-md bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
              {initial}
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">{displayName}</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
