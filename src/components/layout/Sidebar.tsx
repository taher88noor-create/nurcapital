"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAnalystStatus, subscribeAnalystStatus, type AnalystStatus } from "@/lib/api";

const navigation = [
  { name: "Dashboard", href: "/", icon: "◎" },
  { name: "Conviction List", href: "/research", icon: "◆" },
  { name: "Investment Lens", href: "/themes", icon: "◐" },
];

const STATUS_DISPLAY: Record<AnalystStatus, { icon: string; label: string; color: string }> = {
  standby: { icon: "🟡", label: "Analyst: Standby (simulated data)", color: "text-amber-600 dark:text-amber-400" },
  warming: { icon: "⏳", label: "Analyst: Warming up...", color: "text-blue-600 dark:text-blue-400" },
  live: { icon: "🟢", label: "Analyst: Live", color: "text-emerald-600 dark:text-emerald-400" },
  offline: { icon: "🔴", label: "Analyst: Offline", color: "text-red-600 dark:text-red-400" },
};

export function Sidebar() {
  const pathname = usePathname();
  const [status, setStatus] = useState<AnalystStatus>("standby");
  const [timestamp, setTimestamp] = useState<string | null>(null);

  const syncStatus = useCallback(() => {
    const s = getAnalystStatus();
    setStatus(s.status);
    setTimestamp(s.timestamp);
  }, []);

  useEffect(() => {
    syncStatus();
    const unsub = subscribeAnalystStatus(syncStatus);
    return unsub;
  }, [syncStatus]);

  const display = STATUS_DISPLAY[status];

  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-panel dark:border-border-dark dark:bg-panel-dark lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            Nür<span className="text-brand-600"> Capital</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Data Source Indicator */}
      <div className="border-t border-border px-4 py-3 dark:border-border-dark">
        <p className={`text-[10px] font-medium ${display.color}`}>
          {display.icon} {display.label}
        </p>
        {status === "live" && timestamp && (
          <p className="mt-0.5 text-[9px] text-muted-foreground">{timestamp}</p>
        )}
        {status === "warming" && (
          <p className="mt-0.5 text-[9px] text-muted-foreground">Cold start — first request takes ~30s</p>
        )}
        {status === "offline" && (
          <p className="mt-0.5 text-[9px] text-muted-foreground">Backend unreachable after retries</p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 dark:border-border-dark">
        <p className="text-xs text-muted-foreground">
          Ethical intelligence platform
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground/60">v0.1.0</p>
      </div>
    </aside>
  );
}
