"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
};

const COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100 text-green-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
];

export default function MeetPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  function toggleFollow(id: string) {
    setFollowed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-1">Meet Other Friends</h1>
      <p className="text-sm text-gray-400 mb-6">Discover and connect with people on NetSocial</p>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No other users yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {users.map((user, i) => {
            const displayName = user.name || user.username;
            const isFollowed = followed.has(user.id);
            const color = COLORS[i % COLORS.length];
            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${color}`}
                >
                  {displayName[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{displayName}</p>
                  <p className="text-sm text-gray-400 truncate">@{user.username}</p>
                </div>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
                    isFollowed
                      ? "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500"
                      : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
