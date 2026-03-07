"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  user: { name?: string | null; email?: string | null; image?: string | null };
};

const NAV = [
  { href: "/feed", label: "Feed" },
  { href: "/compose", label: "New Post" },
  { href: "/meet", label: "Meet Friends" },
  { href: "/groups", label: "Groups" },
];

export default function Navbar({ user }: Props) {
  const displayName = user.name || user.email || "User";
  const initial = displayName[0].toUpperCase();
  const pathname = usePathname();
  const meActive = pathname === "/me";
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-20" style={{ boxShadow: "0 1px 12px 0 rgba(0,0,0,0.07)" }}>
      <div className="max-w-6xl mx-auto px-8 flex items-center h-16 gap-6">

        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-3 flex-shrink-0 mr-2">
          <div className="w-9 h-9 rounded-full bg-blue-800 border-[2.5px] border-gray-300 flex items-center justify-center select-none flex-shrink-0 shadow-sm">
            <span className="text-white text-[10px] font-black tracking-wider leading-none">US</span>
          </div>
          <span className="text-base font-bold text-gray-900 tracking-tight">NetSocial</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center">
          <div className={`relative transition-all duration-200 ${searchFocused ? "w-80" : "w-36"}`}>
            <svg
              className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${searchFocused ? "text-blue-500" : "text-gray-400"}`}
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={searchFocused ? "Search people..." : "Search..."}
              className={`w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none transition-all duration-200 ${
                searchFocused
                  ? "bg-white border-blue-300 shadow-sm"
                  : "bg-gray-100 border-transparent"
              }`}
            />
          </div>
        </form>

        {/* Profile avatar — links to My Space */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/me">
            <div
              className={`w-9 h-9 rounded-md flex items-center justify-center text-white text-sm font-bold select-none transition-all ${
                meActive
                  ? "bg-blue-600 ring-2 ring-blue-200"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {initial}
            </div>
          </Link>
        </div>

      </div>
    </nav>
  );
}
