"use client";

import { useState } from "react";

type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string | null; username: string; image: string | null };
  _count: { likes: number; comments: number };
};

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

  const timeAgo = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diff = (new Date(post.createdAt).getTime() - Date.now()) / 1000;
  const time =
    Math.abs(diff) < 3600
      ? timeAgo.format(Math.round(diff / 60), "minute")
      : Math.abs(diff) < 86400
      ? timeAgo.format(Math.round(diff / 3600), "hour")
      : timeAgo.format(Math.round(diff / 86400), "day");

  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm">
          {(post.author.name || post.author.username)[0].toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-sm">{post.author.name || post.author.username}</p>
          <p className="text-xs text-gray-400">@{post.author.username} · {time}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed">{post.content}</p>

      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-sm ${
            liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
          }`}
        >
          <span>{liked ? "♥" : "♡"}</span>
          <span>{likes}</span>
        </button>
        <span className="flex items-center gap-1.5 text-sm text-gray-400">
          <span>💬</span>
          <span>{post._count.comments}</span>
        </span>
      </div>
    </div>
  );
}
