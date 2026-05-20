import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="glass rounded-2xl p-10 w-full max-w-md text-center glow-violet">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Welcome to Virala Pro!
        </h1>
        <p className="text-[var(--muted)] mb-8">
          Your subscription is now active. Start creating stunning AI videos and
          images right away.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/generate/video"
            className="w-full py-3 font-semibold text-white rounded-xl gradient-violet hover:opacity-90 transition-opacity"
          >
            Generate Your First Video
          </Link>
          <Link
            href="/dashboard"
            className="w-full py-3 font-semibold text-white rounded-xl bg-[var(--secondary)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
