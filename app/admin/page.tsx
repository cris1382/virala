import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import Navigation from "@/components/navigation";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Double-check admin role
  const isAdmin =
    user.user_metadata?.role === "admin" ||
    process.env.ADMIN_EMAILS?.split(",").includes(user.email ?? "");

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    { data: profiles, count: userCount },
    { data: recentGenerations, count: generationCount },
    { data: imageGenerations },
    { data: videoGenerations },
  ] = await Promise.all([
    adminClient
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(20),
    adminClient
      .from("generations")
      .select("*, profiles(email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(20),
    adminClient
      .from("generations")
      .select("id", { count: "exact" })
      .eq("type", "image"),
    adminClient
      .from("generations")
      .select("id", { count: "exact" })
      .eq("type", "video"),
  ]);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <Navigation email={user.email} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-[var(--muted)] mt-1">Platform overview and management</p>
          </div>
          <span className="px-3 py-1 text-xs font-medium bg-[var(--primary)]/20 text-[var(--accent)] border border-[var(--primary)]/30 rounded-full">
            Admin
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Users", value: userCount ?? 0, icon: "👥" },
            { label: "Total Generations", value: generationCount ?? 0, icon: "⚡" },
            { label: "Images", value: imageGenerations?.length ?? 0, icon: "🎨" },
            { label: "Videos", value: videoGenerations?.length ?? 0, icon: "🎬" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            Users ({userCount ?? 0})
          </h2>
          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left px-4 py-3 text-[var(--muted)] font-medium">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-[var(--muted)] font-medium">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 text-[var(--muted)] font-medium">
                      Plan
                    </th>
                    <th className="text-left px-4 py-3 text-[var(--muted)] font-medium">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profiles?.map((profile) => (
                    <tr
                      key={profile.id}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-white">
                        {profile.email ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            profile.role === "admin"
                              ? "bg-[var(--primary)]/20 text-[var(--accent)]"
                              : "bg-[var(--secondary)] text-[var(--muted)]"
                          }`}
                        >
                          {profile.role ?? "user"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                            profile.subscription_status !== "free"
                              ? "bg-green-900/30 text-green-400"
                              : "bg-[var(--secondary)] text-[var(--muted)]"
                          }`}
                        >
                          {profile.subscription_status ?? "free"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {formatDate(profile.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Recent Generations */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Generations
          </h2>
          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left px-4 py-3 text-[var(--muted)] font-medium">
                      User
                    </th>
                    <th className="text-left px-4 py-3 text-[var(--muted)] font-medium">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-[var(--muted)] font-medium">
                      Prompt
                    </th>
                    <th className="text-left px-4 py-3 text-[var(--muted)] font-medium">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-[var(--muted)] font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentGenerations?.map((gen) => (
                    <tr
                      key={gen.id}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {(gen.profiles as { email?: string } | null)?.email ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-white">{gen.type}</span>
                      </td>
                      <td className="px-4 py-3 text-white max-w-[200px] truncate">
                        {gen.prompt ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            gen.status === "completed"
                              ? "bg-green-900/30 text-green-400"
                              : gen.status === "failed"
                              ? "bg-red-900/30 text-red-400"
                              : "bg-yellow-900/30 text-yellow-400"
                          }`}
                        >
                          {gen.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {formatDate(gen.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
