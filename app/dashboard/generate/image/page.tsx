"use client";

import { useState } from "react";

interface GenerationResult {
  imageUrl: string;
  generationId: string;
}

const STYLE_PRESETS = [
  { label: "Photorealistic", value: "photorealistic, ultra detailed" },
  { label: "Digital Art", value: "digital art, vibrant colors" },
  { label: "Oil Painting", value: "oil painting, classical style" },
  { label: "Anime", value: "anime style, detailed" },
  { label: "Cinematic", value: "cinematic, movie still, dramatic lighting" },
  { label: "Minimalist", value: "minimalist, clean, simple" },
];

const ASPECT_RATIOS = [
  { label: "Square", value: "square_hd" },
  { label: "Landscape", value: "landscape_4_3" },
  { label: "Portrait", value: "portrait_4_3" },
  { label: "Widescreen", value: "landscape_16_9" },
];

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [aspectRatio, setAspectRatio] = useState("landscape_4_3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const fullPrompt = [prompt, selectedStyle].filter(Boolean).join(", ");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, imageSize: aspectRatio }),
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
        <h1 className="text-2xl font-bold text-white">Generate Image</h1>
        <p className="text-[var(--muted)] mt-1">
          Create images from text using Fal.ai FLUX
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-6">
        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Prompt
            <span className="text-[var(--muted)] font-normal ml-2">
              ({prompt.length}/500)
            </span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
            rows={4}
            required
            placeholder="A majestic mountain landscape at golden hour, misty valleys, dramatic clouds..."
            className="w-full px-4 py-3 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
          />
        </div>

        {/* Style presets */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Style Preset
          </label>
          <div className="flex flex-wrap gap-2">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() =>
                  setSelectedStyle(
                    selectedStyle === style.value ? "" : style.value
                  )
                }
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  selectedStyle === style.value
                    ? "border-[var(--primary)] bg-[var(--primary)]/20 text-white"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-white"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect ratio */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Aspect Ratio
          </label>
          <div className="flex flex-wrap gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.value}
                type="button"
                onClick={() => setAspectRatio(ratio.value)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  aspectRatio === ratio.value
                    ? "border-[var(--primary)] bg-[var(--primary)]/20 text-white"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-white"
                }`}
              >
                {ratio.label}
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
          disabled={loading || !prompt.trim()}
          className="w-full py-3 font-semibold text-white rounded-lg gradient-violet hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating…
            </span>
          ) : (
            "Generate Image"
          )}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="mt-6 glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[var(--border)]">
            <p className="text-sm font-medium text-white">Generation Complete</p>
            <p className="text-xs text-[var(--muted)] mt-0.5 truncate">{fullPrompt}</p>
          </div>
          <img
            src={result.imageUrl}
            alt={fullPrompt}
            className="w-full object-contain max-h-[600px]"
          />
          <div className="p-4 flex gap-3">
            <a
              href={result.imageUrl}
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
