"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton({ full }: { full?: boolean }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={
        full
          ? "w-full text-sm font-medium text-red-500 border border-red-200 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
          : "text-sm text-gray-400 hover:text-red-500 transition-colors"
      }
    >
      Sign out
    </button>
  );
}
