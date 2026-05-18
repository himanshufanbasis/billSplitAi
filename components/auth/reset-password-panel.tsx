"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { useToast } from "@/components/shared/toast-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ResetPasswordPanel() {
  const router = useRouter();
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    // Supabase puts tokens in the URL hash: #access_token=...&refresh_token=...&type=recovery
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (type === "recovery" && accessToken && refreshToken) {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (!error) setReady(true);
          else setError(error.message);
        });
      return;
    }

    // Fallback for browsers that strip the hash before navigation
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "").trim();
    const confirm = String(formData.get("confirm") ?? "").trim();

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) throw new Error("Supabase is not configured.");

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      toast("Password updated successfully.");
      router.replace("/dashboard");
    } catch (err) {
      const text = err instanceof Error ? err.message : "Unable to update password.";
      setError(text);
      toast(text, "error");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <Card className="w-full max-w-lg border-brand/10">
        <p className="app-label text-sm">Verifying your reset link, please wait…</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg border-brand/10">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Set new password</h2>
        <p className="app-label mt-1 text-sm">Choose a strong password for your account.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="app-label mb-2 block text-sm font-medium">New password</span>
          <input
            required
            type="password"
            name="password"
            minLength={6}
            className="app-input"
            placeholder="Minimum 6 characters"
          />
        </label>

        <label className="block">
          <span className="app-label mb-2 block text-sm font-medium">Confirm password</span>
          <input
            required
            type="password"
            name="confirm"
            minLength={6}
            className="app-input"
            placeholder="Re-enter new password"
          />
        </label>

        {error ? <p className="app-notice-error rounded-2xl px-4 py-3 text-sm">{error}</p> : null}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </Card>
  );
}
