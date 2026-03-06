"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

type Props = {
  user: { name?: string | null; email?: string | null; image?: string | null };
};

export default function Navbar({ user }: Props) {
  const displayName = user.name || user.email || "User";
  const initial = displayName[0].toUpperCase();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
          NetSocial
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
            {initial}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {displayName}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors ml-1"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
