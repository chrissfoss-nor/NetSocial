"use client";

import { useState } from "react";

type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string | null; username: string; image: string | null };
  _count: { likes: number; comments: number };
};

export default function PostComposer({ onPost }: { onPost: (post: Post) => void }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    setLoading(false);

    if (res.ok) {
      const post = await res.json();
      onPost(post);
      setContent("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow p-4 space-y-3"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        maxLength={500}
        className="w-full resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{content.length}/500</span>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
