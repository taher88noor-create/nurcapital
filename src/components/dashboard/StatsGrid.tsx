const stats = [
  { label: "Approved Assets", value: "142", change: "+3 this week", positive: true },
  { label: "Exposure Alerts", value: "7", change: "2 new signals", positive: false },
  { label: "Themes Active", value: "6", change: "Stable", positive: true },
  { label: "Confidence Score", value: "89%", change: "High", positive: true },
];

export function StatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {stat.value}
          </p>
          <p
            className={`mt-1 text-xs font-medium ${
              stat.positive ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}
