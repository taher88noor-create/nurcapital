export default function ThemesPage() {
  const themes = [
    { name: "Clean Technology", count: 24, icon: "⚡", color: "emerald" },
    { name: "Healthcare Innovation", count: 18, icon: "🧬", color: "blue" },
    { name: "Digital Infrastructure", count: 31, icon: "🌐", color: "violet" },
    { name: "Consumer Staples", count: 15, icon: "🛒", color: "amber" },
    { name: "Emerging Markets", count: 22, icon: "🌍", color: "teal" },
    { name: "Dividend Growth", count: 12, icon: "📈", color: "green" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Themes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Curated investment themes — ethically screened
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <div key={theme.name} className="card cursor-pointer hover:shadow-elevated">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{theme.icon}</span>
              <div>
                <h3 className="font-semibold text-foreground">{theme.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {theme.count} approved assets
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
