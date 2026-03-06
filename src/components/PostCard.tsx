"use client";

import { useState } from "react";

type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string | null; username: string; image: string | null };
  _count: { likes: number; comments: number };
};

function timeAgoFormat(dateStr: string) {
  const diff = (new Date(dateStr).getTime() - Date.now()) / 1000;
  const fmt = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (Math.abs(diff) < 3600) return fmt.format(Math.round(diff / 60), "minute");
  if (Math.abs(diff) < 86400) return fmt.format(Math.round(diff / 3600), "hour");
  return fmt.format(Math.round(diff / 86400), "day");
}

export default function PostCard({
  post,
  currentUserId,
}: {
  post: Post;
  currentUserId: string;
}) {
  const [likes, setLikes] = useState(post._count.likes);
  const [liked, setLiked] = useState(false);

  async function toggleLike() {
    const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
    }
  }

  const authorName = post.author.name || post.author.username;
  const initial = authorName[0].toUpperCase();

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Author */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-700 text-xs font-bold flex-shrink-0">
          {initial}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-none">{authorName}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            @{post.author.username} · {timeAgoFormat(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            liked ? "text-red-500" : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likes}
        </button>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {post._count.comments}
        </span>
      </div>
    </article>
  );
}
