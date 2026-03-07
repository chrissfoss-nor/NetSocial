"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";

type Post = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: { id: string; name: string | null; username: string; image: string | null };
  _count: { likes: number; comments: number };
};

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex-shrink-0" />
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-100 rounded w-24" />
          <div className="h-2.5 bg-gray-100 rounded w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>
    </div>
  );
}

export default function Feed({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => { fetchPosts(); }, []);

  function onNewPost(post: Post) {
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <div className="space-y-3">
      <PostComposer onPost={onNewPost} />
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
          <p className="text-sm font-medium text-gray-900 mb-1">Nothing here yet</p>
          <p className="text-xs text-gray-400">
            Follow people on the{" "}
            <a href="/meet" className="text-blue-600 hover:underline">Meet Friends</a>
            {" "}page to see their posts here.
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={userId} />
        ))
      )}
    </div>
  );
}
