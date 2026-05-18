import { Suspense } from "react";

import { ResetPasswordPanel } from "@/components/auth/reset-password-panel";
import { Logo } from "@/components/shared/logo";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-white/92 via-blue-50/80 to-white/88 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.3)] backdrop-blur dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/95 dark:via-slate-900/80 dark:to-slate-950/90 sm:p-0">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className="surface-grid bg-brand-hero px-6 py-10 text-white dark:bg-brand-hero-dark sm:px-10">
            <div className="flex items-start justify-between gap-4">
              <Logo tone="light" />
            </div>
            <h1 className="mt-10 text-4xl font-semibold tracking-tight text-blue-900">Reset your password</h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-blue-900">
              Enter a new password for your account. You will be redirected to the dashboard after updating.
            </p>
          </div>
          <div className="flex items-center justify-center bg-white px-6 py-10 dark:bg-slate-950 sm:px-10">
            <Suspense fallback={<div className="h-[300px] w-full max-w-lg animate-pulse rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />}>
              <ResetPasswordPanel />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
