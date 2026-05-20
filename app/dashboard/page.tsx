import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ImageCard from "@/components/image-card";
import VideoCard from "@/components/video-card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: generations }, { data: profile }] = await Promise.all([
    supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ]);

  const imageCount = generations?.filter((g) => g.type === "image").length ?? 0;
  const videoCount = generations?.filter((g) => g.type === "video").length ?? 0;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-[var(--muted)] mt-1">
          Welcome back, {user.email?.split("@")[0]}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Images Generated", value: imageCount, icon: "🎨" },
          { label: "Videos Generated", value: videoCount, icon: "🎬" },
          {
            label: "Plan",
            value: profile?.subscription_status ?? "Free",
            icon: "⭐",
          },
          { label: "Account", value: "Active", icon: "✅" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/dashboard/generate/image"
          className="glass rounded-2xl p-6 hover:glow-violet-sm transition-all group block"
        >
          <div className="text-4xl mb-3">🎨</div>
          <h3 className="text-lg font-semibold text-white group-hover:text-[var(--accent)] transition-colors">
            Generate Image
          </h3>
          <p className="text-sm text-[var(--muted)] mt-1">
            Create stunning images from text prompts using Fal.ai FLUX
          </p>
        </Link>
        <Link
          href="/dashboard/generate/video"
          className="glass rounded-2xl p-6 hover:glow-violet-sm transition-all group block"
        >
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="text-lg font-semibold text-white group-hover:text-[var(--accent)] transition-colors">
            Generate Video
          </h3>
          <p className="text-sm text-[var(--muted)] mt-1">
            Create professional videos with Runway ML Gen-3
          </p>
        </Link>
      </div>

      {/* Recent Generations */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent Generations
        </h2>
        {generations && generations.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generations.map((gen) =>
              gen.type === "image" ? (
                <ImageCard
                  key={gen.id}
                  id={gen.id}
                  prompt={gen.prompt}
                  resultUrl={gen.result_url}
                  status={gen.status}
                  createdAt={gen.created_at}
                />
              ) : (
                <VideoCard
                  key={gen.id}
                  id={gen.id}
                  prompt={gen.prompt}
                  resultUrl={gen.result_url}
                  status={gen.status}
                  createdAt={gen.created_at}
                />
              )
            )}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-[var(--muted)]">No generations yet.</p>
            <p className="text-sm text-[var(--muted)] mt-1">
              Start creating with the buttons above!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
