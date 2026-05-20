interface VideoCardProps {
  id: string;
  prompt: string | null;
  resultUrl: string | null;
  status: string;
  createdAt: string;
}

export default function VideoCard({ id, prompt, resultUrl, status, createdAt }: VideoCardProps) {
  return (
    <div className="glass rounded-xl overflow-hidden" key={id}>
      <div className="relative aspect-video bg-[var(--secondary)]">
        {resultUrl && status === "completed" ? (
          <video
            src={resultUrl}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {status === "pending" ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-[var(--muted)]">Generating…</span>
              </div>
            ) : (
              <span className="text-4xl">🎬</span>
            )}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm text-white truncate">{prompt ?? "No prompt"}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-[var(--muted)]">
            {new Date(createdAt).toLocaleDateString()}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              status === "completed"
                ? "bg-green-900/30 text-green-400"
                : status === "failed"
                ? "bg-red-900/30 text-red-400"
                : "bg-yellow-900/30 text-yellow-400"
            }`}
          >
            {status}
          </span>
        </div>
        {resultUrl && status === "completed" && (
          <a
            href={resultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-xs text-center py-1.5 rounded-lg bg-[var(--secondary)] text-[var(--muted)] hover:text-white transition-colors"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
}
