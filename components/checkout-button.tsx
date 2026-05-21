"use client";

import { useState } from "react";

import type { PaidPlanKey } from "@/lib/stripe/config";

interface CheckoutButtonProps {
  plan: PaidPlanKey;
  label: string;
}

export default function CheckoutButton({
  plan,
  label,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const payload = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok || typeof payload.url !== "string") {
        throw new Error(payload.error ?? "Unable to start checkout.");
      }

      window.location.href = payload.url;
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Unable to start checkout."
      );
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className="w-full px-4 py-3 text-sm font-semibold text-white rounded-lg gradient-violet hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}
