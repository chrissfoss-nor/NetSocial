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
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        maxLength={500}
        className="w-full resize-none text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
      />
      <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
        <span className="text-xs text-gray-400">{content.length} / 500</span>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-40 transition-colors"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
