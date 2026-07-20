"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/", icon: "◎" },
  { name: "Conviction List", href: "/research", icon: "◆" },
  { name: "Investment Lens", href: "/themes", icon: "◐" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [dataStatus, setDataStatus] = useState<{ live: boolean; timestamp: string | null }>({ live: false, timestamp: null });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nc_prices");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.prices && Object.keys(parsed.prices).length > 0) {
          setDataStatus({ live: true, timestamp: parsed.timestamp || null });
        }
      }
    } catch { /* ignore */ }
  }, []);

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
        {dataStatus.live ? (
          <div>
            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">🟢 Analyst: Live</p>
            <p className="mt-0.5 text-[9px] text-muted-foreground">{dataStatus.timestamp}</p>
          </div>
        ) : (
          <div>
            <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400">🟡 Analyst: Standby (simulated data)</p>
          </div>
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
