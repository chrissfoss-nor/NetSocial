"use client";

import { useState, useEffect, useCallback } from "react";

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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/users?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
    setSearched(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-1">Search</h1>
      <p className="text-sm text-gray-400 mb-5">Find students and friends on NetSocial</p>

      {/* Search input */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
          &#9906;
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or username..."
          autoFocus
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            &times;
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Searching...</div>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No users found for &ldquo;{query}&rdquo;
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 px-1">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          {results.map((user, i) => {
            const displayName = user.name || user.username;
            const color = COLORS[i % COLORS.length];
            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 ${color}`}
                >
                  {displayName[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{displayName}</p>
                  <p className="text-sm text-gray-400 truncate">@{user.username}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-300 text-sm">
          Start typing to search for students
        </div>
      )}
    </div>
  );
}
