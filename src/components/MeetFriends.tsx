"use client";

import { useEffect, useState } from "react";

type SuggestedUser = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
};

export default function MeetFriends() {
  const [users, setUsers] = useState<SuggestedUser[]>([]);
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Meet Other Friends</h2>

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          No other users yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => {
            const displayName = user.name || user.username;
            const isFollowed = followed.has(user.id);
            return (
              <li key={user.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                  {displayName[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    @{user.username}
                  </p>
                </div>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
                    isFollowed
                      ? "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500"
                      : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
