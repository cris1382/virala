import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{ background: "var(--background)", minHeight: "100vh" }}
      className="flex flex-col"
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[var(--border)]">
        <span className="text-2xl font-bold gradient-violet-text">Virala</span>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-[var(--muted)] hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 text-sm font-medium text-white rounded-lg gradient-violet hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-sm text-[var(--accent)]">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          AI-Powered Generation
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 max-w-4xl leading-tight">
          Create{" "}
          <span className="gradient-violet-text">Stunning Visuals</span>
          {" "}with AI
        </h1>

        <p className="text-lg text-[var(--muted)] mb-10 max-w-2xl">
          Generate professional-quality images and videos in seconds using
          state-of-the-art AI models. No creative limits — just your imagination.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="px-8 py-4 text-base font-semibold text-white rounded-xl gradient-violet glow-violet hover:opacity-90 transition-opacity"
          >
            Start Creating Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 text-base font-semibold text-white rounded-xl bg-[var(--secondary)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎨",
              title: "Image Generation",
              desc: "Create photorealistic images from text prompts using Fal.ai's cutting-edge models.",
            },
            {
              icon: "🎬",
              title: "Video Generation",
              desc: "Transform ideas into stunning videos with Runway ML's powerful generation engine.",
            },
            {
              icon: "⚡",
              title: "Lightning Fast",
              desc: "Generate high-quality visuals in seconds, not minutes. Built for speed and creativity.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-6 hover:glow-violet-sm transition-all"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-sm text-[var(--muted)] border-t border-[var(--border)]">
        © {new Date().getFullYear()} Virala. All rights reserved.
      </footer>
    </main>
  );
}
