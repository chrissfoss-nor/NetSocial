"use client";

import { useRef, useState } from "react";

type Post = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: { id: string; name: string | null; username: string; image: string | null };
  _count: { likes: number; comments: number };
};

export default function PostComposer({ onPost }: { onPost: (post: Post) => void }) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;
    setLoading(true);

    let imageUrl: string | null = null;
    if (imageFile) {
      const form = new FormData();
      form.append("file", imageFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      if (uploadRes.ok) {
        const data = await uploadRes.json();
        imageUrl = data.url;
      }
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, imageUrl }),
    });

    setLoading(false);

    if (res.ok) {
      const post = await res.json();
      onPost(post);
      setContent("");
      removeImage();
    }
  }

  const canPost = !loading && (!!content.trim() || !!imageFile);

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
      {imagePreview && (
        <div className="relative mt-2 mb-1">
          <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded-md border border-gray-200" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-sm w-5 h-5 text-xs flex items-center justify-center hover:bg-black/80"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            title="Attach image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <span className="text-xs text-gray-400">{content.length} / 500</span>
        </div>
        <button
          type="submit"
          disabled={!canPost}
          className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-40 transition-colors"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </form>
  );
}
