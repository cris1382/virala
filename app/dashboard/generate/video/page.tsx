"use client";

import { useState } from "react";

interface VideoResult {
  videoUrl: string;
  generationId: string;
}

const DURATION_OPTIONS = [5, 10] as const;
const RATIO_OPTIONS = [
  { label: "16:9 (Landscape)", value: "1280:720" },
  { label: "9:16 (Portrait)", value: "720:1280" },
  { label: "1:1 (Square)", value: "1024:1024" },
];

export default function GenerateVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [duration, setDuration] = useState<5 | 10>(5);
  const [ratio, setRatio] = useState("1280:720");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || !imageUrl.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageUrl, duration, ratio }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Generation failed");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Generate Video</h1>
        <p className="text-[var(--muted)] mt-1">
          Create videos from images using Runway ML Gen-3
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-6">
        {/* Reference Image URL */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Reference Image URL <span className="text-[var(--destructive)]">*</span>
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            placeholder="https://example.com/your-image.jpg"
            className="w-full px-4 py-3 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <p className="text-xs text-[var(--muted)] mt-1.5">
            Paste a URL of an image. Use a generated image from the Image tab or any public image URL.
          </p>
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Motion Prompt
            <span className="text-[var(--muted)] font-normal ml-2">
              ({prompt.length}/500)
            </span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
            rows={3}
            required
            placeholder="Camera slowly pans right, gentle breeze moves the leaves, cinematic motion..."
            className="w-full px-4 py-3 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Duration
          </label>
          <div className="flex gap-2">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  duration === d
                    ? "border-[var(--primary)] bg-[var(--primary)]/20 text-white"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-white"
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        {/* Ratio */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Aspect Ratio
          </label>
          <div className="flex flex-wrap gap-2">
            {RATIO_OPTIONS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRatio(r.value)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  ratio === r.value
                    ? "border-[var(--primary)] bg-[var(--primary)]/20 text-white"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-[var(--destructive)] bg-red-900/10 border border-red-900/30 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !prompt.trim() || !imageUrl.trim()}
          className="w-full py-3 font-semibold text-white rounded-lg gradient-violet hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating (may take 2–3 min)…
            </span>
          ) : (
            "Generate Video"
          )}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="mt-6 glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[var(--border)]">
            <p className="text-sm font-medium text-white">Video Ready!</p>
            <p className="text-xs text-[var(--muted)] mt-0.5 truncate">{prompt}</p>
          </div>
          <video
            src={result.videoUrl}
            controls
            autoPlay
            loop
            className="w-full"
          />
          <div className="p-4 flex gap-3">
            <a
              href={result.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex-1 text-center py-2 text-sm font-medium rounded-lg gradient-violet text-white hover:opacity-90 transition-opacity"
            >
              Download
            </a>
            <button
              onClick={() => {
                setPrompt("");
                setImageUrl("");
                setResult(null);
              }}
              className="flex-1 py-2 text-sm font-medium rounded-lg bg-[var(--secondary)] text-white border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
            >
              Generate New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
