"use client";

import { useState, useEffect, useCallback } from "react";

type User = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
};

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
      <div className="mb-5">
        <h1 className="text-base font-semibold text-gray-900">Search</h1>
        <p className="text-sm text-gray-400 mt-0.5">Find students and friends on NetSocial</p>
      </div>

      {/* Search input */}
      <div className="relative mb-5">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or username..."
          autoFocus
          className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-base leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-md bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-28" />
                <div className="h-2.5 bg-gray-100 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : searched && results.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-sm text-gray-400">
          No users found for &ldquo;{query}&rdquo;
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 mb-3">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          {results.map((user) => {
            const displayName = user.name || user.username;
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
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-10">
          Start typing to search
        </p>
      )}
    </div>
  );
}
