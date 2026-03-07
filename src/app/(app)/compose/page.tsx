"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Step = 1 | 2;
type Consent = "pending" | "allowed" | "denied";
type Photo = { file: File; preview: string };

export default function ComposePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [consent, setConsent] = useState<Consent>("pending");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAllow() {
    setConsent("allowed");
    fileRef.current?.click();
  }

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) return;
    const newPhotos = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    setSelectedIndex(0);
  }

  function selectPhoto(index: number) {
    setSelectedIndex(index);
  }

  function removePhoto(index: number, e: React.MouseEvent) {
    e.stopPropagation();
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      if (prev === index) return photos.length > 1 ? 0 : null;
      if (prev > index) return prev - 1;
      return prev;
    });
  }

  function goBack() {
    if (step === 2) {
      setStep(1);
      setContent("");
      setError("");
    } else {
      router.back();
    }
  }

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() && !selectedPhoto) return;
    setLoading(true);
    setError("");

    let imageUrl: string | null = null;
    if (selectedPhoto) {
      const form = new FormData();
      form.append("file", selectedPhoto.file);
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
  const canPost = !loading && (!!content.trim() || !!selectedPhoto);

  return (
    <div className="max-w-2xl">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-6">
        {(["Add Photo", "Write Caption"] as const).map((label, i) => {
          const active = step === i + 1;
          const done = step > i + 1;
          return (
            <div key={label} className="flex items-center">
              {i > 0 && <div className={`h-px w-8 ${step > 1 ? "bg-blue-300" : "bg-gray-200"}`} />}
              <div className={`flex items-center gap-2 px-4 py-2 border text-sm font-medium transition-colors ${
                i === 0 ? "rounded-l-md" : "rounded-r-md"
              } ${active ? "bg-blue-600 border-blue-600 text-white" : done ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-400"}`}>
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                  active ? "bg-white text-blue-600" : done ? "bg-blue-200 text-blue-700" : "bg-gray-100 text-gray-400"
                }`}>
                  {done ? "✓" : i + 1}
                </span>
                {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 1: Photo Selection */}
      {step === 1 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

          {/* Consent screen */}
          {consent === "pending" && (
            <div className="p-8 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Allow access to your photos</p>
                <p className="text-xs text-gray-500 mt-1.5 max-w-xs leading-relaxed">
                  NetSocial would like to access your photos so you can select images to share in your posts. Your photos are only used when you choose to share them.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <button
                  onClick={handleAllow}
                  className="w-full bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Allow Access
                </button>
                <button
                  onClick={() => setConsent("denied")}
                  className="w-full bg-white text-gray-500 text-sm font-medium py-2.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Don't Allow
                </button>
              </div>
            </div>
          )}

          {/* Denied screen */}
          {consent === "denied" && (
            <div className="p-8 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Photo access denied</p>
                <p className="text-xs text-gray-400 mt-1">You can still write a text-only post.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConsent("pending")}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Grant access
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  Continue without photo
                </button>
              </div>
            </div>
          )}

          {/* Photo grid */}
          {consent === "allowed" && (
            <div>
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">
                  {photos.length > 0 ? `${photos.length} photo${photos.length !== 1 ? "s" : ""} selected` : "No photos yet"}
                </p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  + Add more
                </button>
              </div>

              {photos.length === 0 ? (
                <div
                  className="mx-5 mb-5 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center py-12 gap-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p className="text-sm text-gray-400">Click to select photos</p>
                </div>
              ) : (
                <div className="px-5 pb-3 grid grid-cols-3 gap-2">
                  {photos.map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => selectPhoto(i)}
                      className={`relative cursor-pointer rounded-md overflow-hidden aspect-square border-2 transition-all ${
                        selectedIndex === i ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                      {selectedIndex === i && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => removePhoto(i, e)}
                        className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ opacity: selectedIndex === i ? 0 : undefined }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="px-5 pb-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Skip photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={selectedIndex === null}
                    className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-40 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Write Caption */}
      {step === 2 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className={`p-5 ${selectedPhoto ? "flex gap-4" : ""}`}>
              {selectedPhoto && (
                <div className="relative flex-shrink-0 w-48">
                  <img
                    src={selectedPhoto.preview}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => { setSelectedIndex(null); setStep(1); }}
                    className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-sm w-5 h-5 text-xs flex items-center justify-center hover:bg-black/80"
                  >
                    ✕
                  </button>
                  <p className="text-xs text-gray-400 mt-1.5 text-center">
                    <button type="button" onClick={() => setStep(1)} className="hover:text-gray-600 underline underline-offset-2">
                      Change photo
                    </button>
                  </p>
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={selectedPhoto ? "Add a caption..." : "What's on your mind?"}
                  rows={selectedPhoto ? 7 : 8}
                  maxLength={500}
                  autoFocus
                  className="w-full resize-none text-sm text-gray-900 placeholder-gray-400 leading-relaxed focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
              <span className={`text-xs ${remaining < 50 ? "text-orange-500" : "text-gray-400"}`}>
                {remaining} left
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!canPost}
                  className="bg-gray-900 text-white text-xs font-semibold px-5 py-2 rounded-md hover:bg-gray-700 disabled:opacity-40 transition-colors"
                >
                  {loading ? "Posting..." : "Publish"}
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-red-500 px-5 pb-3">{error}</p>}
          </form>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesChange}
      />
    </div>
  );
}
