"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
};

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
      <div className="mb-5">
        <h1 className="text-base font-semibold text-gray-900">Meet Other Friends</h1>
        <p className="text-sm text-gray-400 mt-0.5">Discover and connect with people on NetSocial</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-md bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-28" />
                <div className="h-2.5 bg-gray-100 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-sm text-gray-400">
          No other users yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {users.map((user) => {
            const displayName = user.name || user.username;
            const isFollowed = followed.has(user.id);
            return (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center text-gray-700 text-sm font-bold flex-shrink-0">
                  {displayName[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate">@{user.username}</p>
                </div>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors flex-shrink-0 ${
                    isFollowed
                      ? "border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200"
                      : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
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
