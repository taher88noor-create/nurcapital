export default function ResearchPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Research & Insights
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ethical exposure intelligence and market research
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="search"
          placeholder="Search company, ticker, or theme..."
          className="w-full rounded-lg border border-border bg-panel px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-border-dark dark:bg-panel-dark"
        />
      </div>

      {/* Research cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <span className="badge badge-red mb-3">Exposure Identified</span>
          <h3 className="font-semibold">Project Nimbus Analysis</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Cloud infrastructure contracts with Israeli government and military
          </p>
          <span className="mt-3 block text-xs text-muted-foreground">
            Updated: May 2026
          </span>
        </div>
        <div className="card">
          <span className="badge badge-green mb-3">Clear</span>
          <h3 className="font-semibold">Clean Energy ETF Screening</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Renewable energy funds with no identified exposure
          </p>
          <span className="mt-3 block text-xs text-muted-foreground">
            Updated: May 2026
          </span>
        </div>
      </div>
    </div>
  );
}
