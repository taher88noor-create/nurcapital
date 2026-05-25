export default function AssetDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      <div>
        <a
          href="/assets"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Assets
        </a>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Asset: {params.id.toUpperCase()}
        </h1>
      </div>

      {/* Screening summary */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Screening Summary
        </h2>
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-green">✓ Sharia Compliant</span>
          <span className="badge badge-blue">✓ No Israel Exposure</span>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-3 font-semibold">Exposure Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Detailed exposure breakdown loading...
          </p>
        </div>
        <div className="card">
          <h3 className="mb-3 font-semibold">Confidence & Evidence</h3>
          <p className="text-sm text-muted-foreground">
            Evidence sources and confidence scoring loading...
          </p>
        </div>
      </div>
    </div>
  );
}
