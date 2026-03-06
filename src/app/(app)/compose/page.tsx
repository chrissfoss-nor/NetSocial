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
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Create a Post</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={7}
            maxLength={500}
            autoFocus
            className="w-full resize-none text-gray-900 placeholder-gray-400 text-base leading-relaxed focus:outline-none"
          />

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <span
              className={`text-sm ${
                remaining < 50 ? "text-orange-500" : "text-gray-400"
              }`}
            >
              {remaining} characters left
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
