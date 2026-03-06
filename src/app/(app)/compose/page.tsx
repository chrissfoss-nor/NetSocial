"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ComposePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/feed");
      router.refresh();
    } else {
      setError("Something went wrong. Please try again.");
    }
  }

  const remaining = 500 - content.length;

  return (
    <div className="max-w-2xl">
      <h1 className="text-base font-semibold text-gray-900 mb-4">New Post</h1>

      <div className="bg-white border border-gray-200 rounded-lg">
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={8}
            maxLength={500}
            autoFocus
            className="w-full resize-none text-sm text-gray-900 placeholder-gray-400 leading-relaxed focus:outline-none p-5"
          />
          <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
            <span className={`text-xs ${remaining < 50 ? "text-orange-500" : "text-gray-400"}`}>
              {remaining} left
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                {loading ? "Posting..." : "Publish"}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-red-500 px-5 pb-3">{error}</p>}
        </form>
      </div>
    </div>
  );
}
