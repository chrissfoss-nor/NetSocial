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
    setPhotos((prev) => {
      const updated = [...prev, ...newPhotos];
      if (selectedIndex === null) setSelectedIndex(0);
      return updated;
    });
  }

  function removePhoto(index: number, e: React.MouseEvent) {
    e.stopPropagation();
    setPhotos((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setSelectedIndex(next.length === 0 ? null : Math.min(index, next.length - 1));
      return next;
    });
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
    <div className="max-w-xl">

      {/* ── STEP 1: Photo picker ── */}
      {step === 1 && (
        <>
          {/* Consent */}
          {consent === "pending" && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Hero */}
              <div className="relative px-8 pt-14 pb-10 flex flex-col items-center text-center"
                style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-10"
                  style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(-40%, -40%)" }} />
                <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full opacity-10"
                  style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(40%, 40%)" }} />
                <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Access Your Photos</h2>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  NetSocial needs permission to access your photo library to let you share images in your posts.
                </p>
              </div>

              {/* Permission details */}
              <div className="px-6 py-5 space-y-3.5 border-b border-gray-100">
                {[
                  { icon: "🔒", label: "Private by default", text: "Photos are never accessed without your action" },
                  { icon: "✋", label: "You choose", text: "Only the photo you select will be shared" },
                  { icon: "↩", label: "Revocable", text: "You can deny access at any time" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-base leading-none mt-0.5 flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="px-6 py-5 flex flex-col gap-2.5">
                <button
                  onClick={handleAllow}
                  className="w-full text-white text-sm font-semibold py-3 rounded-lg transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #1a1a2e, #0f3460)" }}
                >
                  Allow Photo Access
                </button>
                <button
                  onClick={() => setConsent("denied")}
                  className="w-full text-gray-500 text-sm font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Don't Allow
                </button>
              </div>
            </div>
          )}

          {/* Denied */}
          {consent === "denied" && (
            <div className="bg-white border border-gray-200 rounded-xl px-8 py-16 flex flex-col items-center text-center gap-5">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Photo access denied</p>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
                  You can still write a text-only post, or grant access to add a photo.
                </p>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setConsent("pending")}
                  className="text-white text-xs font-semibold px-5 py-2 rounded-lg transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #1a1a2e, #0f3460)" }}
                >
                  Grant Access
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="text-gray-600 text-xs font-medium px-5 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Text only
                </button>
              </div>
            </div>
          )}

          {/* Photo picker */}
          {consent === "allowed" && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                  Cancel
                </button>
                <h2 className="text-sm font-semibold text-gray-900">New Post</h2>
                <button
                  onClick={() => setStep(2)}
                  disabled={selectedIndex === null}
                  className="text-sm font-semibold disabled:text-gray-300 transition-colors"
                  style={{ color: selectedIndex !== null ? "#0f3460" : undefined }}
                >
                  Next →
                </button>
              </div>

              {/* Large preview */}
              <div className="w-full bg-gray-950 relative" style={{ aspectRatio: "1/1", maxHeight: 360 }}>
                {selectedPhoto ? (
                  <>
                    <img
                      src={selectedPhoto.preview}
                      alt="Selected"
                      className="w-full h-full object-cover"
                      style={{ maxHeight: 360 }}
                    />
                    <div className="absolute bottom-3 right-3 text-white text-xs px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
                      {selectedIndex! + 1} / {photos.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ minHeight: 220 }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p className="text-xs text-gray-600">Select a photo below</p>
                  </div>
                )}
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  {photos.length > 0 ? `${photos.length} photo${photos.length !== 1 ? "s" : ""}` : "Library"}
                </span>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Photos
                </button>
              </div>

              {/* Grid */}
              {photos.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center gap-4 py-14 cursor-pointer group"
                  onClick={() => fileRef.current?.click()}
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">Open photo library</p>
                    <p className="text-xs text-gray-400 mt-0.5">Tap to select one or more images</p>
                  </div>
                  <button
                    type="button"
                    className="text-white text-xs font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(135deg, #1a1a2e, #0f3460)" }}
                  >
                    Browse Photos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-0.5 p-0.5 max-h-52 overflow-y-auto bg-gray-100">
                  {photos.map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedIndex(i)}
                      className="relative cursor-pointer aspect-square overflow-hidden"
                    >
                      <img
                        src={photo.preview}
                        alt=""
                        className={`w-full h-full object-cover transition-opacity ${selectedIndex === i ? "opacity-100" : "opacity-75 hover:opacity-95"}`}
                      />
                      {selectedIndex === i && (
                        <>
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow"
                            style={{ background: "linear-gradient(135deg, #1a1a2e, #0f3460)" }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={(e) => removePhoto(i, e)}
                        className="absolute top-1 left-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-[10px] hover:bg-black/80 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Skip — text only
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={selectedIndex === null}
                  className="text-white text-sm font-semibold px-6 py-2 rounded-lg disabled:opacity-30 hover:opacity-90 transition-all active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #1a1a2e, #0f3460)" }}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── STEP 2: Caption ── */}
      {step === 2 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              ← Back
            </button>
            <h2 className="text-sm font-semibold text-gray-900">Write Caption</h2>
            <div className="w-10" />
          </div>

          <form onSubmit={handleSubmit}>
            {selectedPhoto && (
              <div className="relative">
                <img
                  src={selectedPhoto.preview}
                  alt="Preview"
                  className="w-full object-cover border-b border-gray-100"
                  style={{ maxHeight: 300 }}
                />
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
                  style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
                >
                  Change
                </button>
              </div>
            )}

            <div className="p-5">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={selectedPhoto ? "Write a caption..." : "What's on your mind?"}
                rows={5}
                maxLength={500}
                autoFocus
                className="w-full resize-none text-sm text-gray-900 placeholder-gray-400 leading-relaxed focus:outline-none"
              />
            </div>

            <div className="border-t border-gray-100 px-5 py-3.5 flex items-center justify-between">
              <span className={`text-xs ${remaining < 50 ? "text-orange-500" : "text-gray-400"}`}>
                {remaining} left
              </span>
              <button
                type="submit"
                disabled={!canPost}
                className="text-white text-sm font-semibold px-6 py-2 rounded-lg disabled:opacity-30 hover:opacity-90 transition-all active:scale-[0.98]"
                style={{ background: canPost ? "linear-gradient(135deg, #1a1a2e, #0f3460)" : "#9ca3af" }}
              >
                {loading ? "Publishing..." : "Publish"}
              </button>
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
