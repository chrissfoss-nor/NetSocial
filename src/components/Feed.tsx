"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";

type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string | null; username: string; image: string | null };
  _count: { likes: number; comments: number };
};

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
    <div className="space-y-4">
      <PostComposer onPost={onNewPost} />
      {loading ? (
        <p className="text-center text-gray-400 py-8">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No posts yet. Be the first!</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={userId} />
        ))
      )}
    </div>
  );
}
