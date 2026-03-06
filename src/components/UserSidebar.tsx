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
  { href: "/feed", label: "Home", icon: "⌂" },
  { href: "/compose", label: "New Post", icon: "✏" },
  { href: "/meet", label: "Meet Friends", icon: "◎" },
  { href: "/profile", label: "My Profile", icon: "◉" },
  { href: "/search", label: "Search", icon: "⌕" },
];

export default function UserSidebar({ user }: Props) {
  const pathname = usePathname();
  const displayName = user.name || user.username;
  const initial = displayName[0].toUpperCase();

  return (
    <div className="space-y-4">
      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
            {initial}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{displayName}</p>
            <p className="text-sm text-gray-400">@{user.username}</p>
          </div>
          {user.bio && (
            <p className="text-sm text-gray-500 leading-relaxed">{user.bio}</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 pt-4">
          <div className="text-center">
            <p className="font-semibold text-gray-900 text-sm">—</p>
            <p className="text-xs text-gray-400 mt-0.5">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 text-sm">—</p>
            <p className="text-xs text-gray-400 mt-0.5">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 text-sm">—</p>
            <p className="text-xs text-gray-400 mt-0.5">Following</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
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
