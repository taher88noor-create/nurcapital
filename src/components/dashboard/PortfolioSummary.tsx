const allocation = [
  { name: "Clean Technology", pct: 28, color: "bg-emerald-500" },
  { name: "Healthcare", pct: 22, color: "bg-blue-500" },
  { name: "Consumer Staples", pct: 20, color: "bg-amber-500" },
  { name: "Digital Infra", pct: 18, color: "bg-violet-500" },
  { name: "Cash / Sukuk", pct: 12, color: "bg-slate-400" },
];

export function PortfolioSummary() {
  return (
    <div className="card">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Suggested Allocation
      </h2>

      {/* Bar */}
      <div className="mb-4 flex h-3 overflow-hidden rounded-full">
        {allocation.map((a) => (
          <div
            key={a.name}
            className={`${a.color}`}
            style={{ width: `${a.pct}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {allocation.map((a) => (
          <div key={a.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${a.color}`} />
              <span className="text-sm text-foreground">{a.name}</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {a.pct}%
            </span>
          </div>
        ))}
      </div>

      <a
        href="/portfolio"
        className="mt-4 block text-center text-xs font-medium text-brand-600 hover:text-brand-700"
      >
        Customise allocation →
      </a>
    </div>
  );
}
