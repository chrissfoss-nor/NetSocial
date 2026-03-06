"use client";

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
  const meActive = pathname === "/me";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 flex items-stretch h-14">

        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2.5 mr-8 flex-shrink-0">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs font-bold select-none">
            N
          </div>
          <span className="text-sm font-bold text-gray-900 tracking-tight">NetSocial</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-stretch gap-0.5 flex-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3.5 text-sm border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? "border-blue-600 text-gray-900 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Profile avatar — links to My Space */}
        <div className="flex items-center pl-4 flex-shrink-0">
          <Link
            href="/me"
            className={`flex items-center border-b-2 h-full transition-colors ${
              meActive ? "border-blue-600" : "border-transparent hover:border-gray-300"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold select-none transition-colors ${
                meActive ? "bg-blue-600" : "bg-gray-900 hover:bg-gray-700"
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
