"use client";

import { useEffect, useState } from "react";

type Group = {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  memberCount: number;
  isMember: boolean;
};

function GroupCard({ group, onToggle }: { group: Group; onToggle: (id: string, joined: boolean) => void }) {
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch(`/api/groups/${group.id}/join`, { method: "POST" });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      onToggle(group.id, data.joined);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{group.name}</p>
        {group.description && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{group.description}</p>
        )}
        {group.website && (
          <a
            href={group.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-0.5 inline-block truncate max-w-xs"
          >
            {group.website.replace(/^https?:\/\//, "")}
          </a>
        )}
        <p className="text-xs text-gray-400 mt-1.5">
          {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
          {group.isMember && <span className="ml-2 text-blue-600 font-medium">· Joined</span>}
        </p>
      </div>
      <button
        onClick={toggle}
        disabled={loading}
        className={`flex-shrink-0 text-xs font-semibold px-4 py-1.5 rounded-md border transition-colors disabled:opacity-40 ${
          group.isMember
            ? "bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
            : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? "..." : group.isMember ? "Leave" : "Join"}
      </button>
    </div>
  );
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/groups")
      .then((r) => r.json())
      .then((data) => { setGroups(data); setLoading(false); });
  }, []);

  function handleToggle(id: string, joined: boolean) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, isMember: joined, memberCount: g.memberCount + (joined ? 1 : -1) }
          : g
      )
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc, website: newWebsite }),
    });
    setCreating(false);
    if (res.ok) {
      const group = await res.json();
      setGroups((prev) => [...prev, { ...group, memberCount: 0, isMember: false }]);
      setNewName("");
      setNewDesc("");
      setNewWebsite("");
      setShowCreate(false);
    }
  }

  const joined = groups.filter((g) => g.isMember);
  const notJoined = groups.filter((g) => !g.isMember);

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Student Groups</h1>
          <p className="text-sm text-gray-400 mt-0.5">Join groups to connect with fellow students</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className={`text-xs font-semibold px-4 py-2 rounded-md border transition-colors ${
            showCreate
              ? "bg-white border-gray-200 text-gray-600"
              : "bg-gray-900 border-gray-900 text-white hover:bg-gray-700"
          }`}
        >
          {showCreate ? "Cancel" : "+ New Group"}
        </button>
      </div>

      {/* Create group form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-lg p-5 mb-5">
          <p className="text-sm font-semibold text-gray-900 mb-3">Create a new group</p>
          <div className="space-y-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Group name"
              maxLength={60}
              autoFocus
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Short description (optional)"
              maxLength={120}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
            <input
              type="url"
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
              placeholder="Website URL (optional, e.g. https://example.com)"
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="bg-gray-900 text-white text-xs font-semibold px-5 py-2 rounded-md hover:bg-gray-700 disabled:opacity-40 transition-colors"
            >
              {creating ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 flex gap-4 animate-pulse">
              <div className="w-11 h-11 rounded-md bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-48" />
                <div className="h-2.5 bg-gray-100 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-sm font-medium text-gray-900 mb-1">No groups yet</p>
          <p className="text-xs text-gray-400">Create the first student group above!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {joined.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Your Groups</p>
              <div className="space-y-2">
                {joined.map((g) => <GroupCard key={g.id} group={g} onToggle={handleToggle} />)}
              </div>
            </div>
          )}
          {notJoined.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {joined.length > 0 ? "Discover Groups" : "All Groups"}
              </p>
              <div className="space-y-2">
                {notJoined.map((g) => <GroupCard key={g.id} group={g} onToggle={handleToggle} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
