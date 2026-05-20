"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface NavigationProps {
  email?: string;
}

export default function Navigation({ email }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/generate/image", label: "Image" },
    { href: "/dashboard/generate/video", label: "Video" },
  ];

  return (
    <nav className="border-b border-[var(--border)] px-6 py-4 sticky top-0 z-40"
      style={{ background: "rgba(10, 10, 15, 0.9)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold gradient-violet-text">
            Virala
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  pathname === link.href
                    ? "bg-[var(--secondary)] text-white"
                    : "text-[var(--muted)] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {email && (
            <span className="hidden sm:block text-sm text-[var(--muted)] truncate max-w-[180px]">
              {email}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-[var(--muted)] hover:text-white border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
