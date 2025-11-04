"use client";

import { UserButton } from "@clerk/nextjs";

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}

