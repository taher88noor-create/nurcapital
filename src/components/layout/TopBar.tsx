"use client";

export function TopBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6 dark:border-border-dark">
      {/* Mobile logo (hidden on desktop) */}
      <div className="lg:hidden">
        <span className="text-lg font-bold tracking-tight">
          Nür<span className="text-brand-600"> Capital</span>
        </span>
      </div>

      {/* Search */}
      <div className="hidden max-w-sm flex-1 lg:block">
        <input
          type="search"
          placeholder="Search assets, themes, research..."
          className="w-full rounded-lg border border-border bg-panel px-4 py-2 text-sm placeholder:text-muted-foreground focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-border-dark dark:bg-panel-dark"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        >
          ◑
        </button>
        <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900" />
      </div>
    </header>
  );
}
