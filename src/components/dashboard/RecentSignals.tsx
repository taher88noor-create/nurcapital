const signals = [
  {
    id: 1,
    type: "exposure",
    title: "New procurement relationship identified",
    entity: "Microsoft Corporation",
    date: "2 hours ago",
  },
  {
    id: 2,
    type: "update",
    title: "Holdings analysis updated",
    entity: "Vanguard S&P 500 ETF",
    date: "6 hours ago",
  },
  {
    id: 3,
    type: "clear",
    title: "No exposure signals detected",
    entity: "Novo Nordisk",
    date: "1 day ago",
  },
  {
    id: 4,
    type: "exposure",
    title: "Government contract reporting detected",
    entity: "Alphabet Inc.",
    date: "2 days ago",
  },
];

export function RecentSignals() {
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recent Signals
        </h2>
        <a
          href="/research"
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          View all →
        </a>
      </div>
      <div className="space-y-3">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted dark:hover:bg-muted"
          >
            <span
              className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                signal.type === "exposure"
                  ? "bg-red-500"
                  : signal.type === "clear"
                  ? "bg-emerald-500"
                  : "bg-blue-500"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {signal.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {signal.entity} · {signal.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
