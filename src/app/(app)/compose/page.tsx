"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ComposePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    setError("");

    let imageUrl: string | null = null;
    if (imageFile) {
      const form = new FormData();
      form.append("file", imageFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      if (!uploadRes.ok) {
        setError("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
      const data = await uploadRes.json();
      imageUrl = data.url;
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, imageUrl }),
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
  const canPost = !loading && (!!content.trim() || !!imageFile);

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
          {imagePreview && (
            <div className="relative px-5 pb-3">
              <img src={imagePreview} alt="Preview" className="w-full max-h-80 object-cover rounded-md border border-gray-200" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1.5 right-6.5 bg-black/60 text-white rounded-sm w-5 h-5 text-xs flex items-center justify-center hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          )}
          <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
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
              <span className={`text-xs ${remaining < 50 ? "text-orange-500" : "text-gray-400"}`}>
                {remaining} left
              </span>
            </div>
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
                disabled={!canPost}
                className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                {loading ? "Posting..." : "Publish"}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-red-500 px-5 pb-3">{error}</p>}
        </form>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
