"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username: string;
    bio?: string | null;
  };
};

const navItems = [
  { href: "/feed", label: "Home" },
  { href: "/compose", label: "New Post" },
  { href: "/meet", label: "Meet Friends" },
  { href: "/me", label: "My Space" },
  { href: "/search", label: "Search" },
];

export default function UserSidebar({ user }: Props) {
  const pathname = usePathname();
  const displayName = user.name || user.username;
  const initial = displayName[0].toUpperCase();

  return (
    <div>
      {/* User identity */}
      <div className="flex items-center gap-3 px-2 mb-6 pb-4 border-b border-gray-200">
        <div className="w-8 h-8 rounded-md bg-gray-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
          <p className="text-xs text-gray-400 truncate">@{user.username}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
          Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2 py-2 text-sm rounded-md transition-colors ${
                    active
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span
                    className={`w-0.5 h-4 rounded-sm flex-shrink-0 transition-colors ${
                      active ? "bg-blue-600" : "bg-transparent"
                    }`}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
