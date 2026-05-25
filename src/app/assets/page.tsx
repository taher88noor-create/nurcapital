export default function ApprovedAssetsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approved Assets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ethically screened equities, ETFs, and funds
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <button className="badge badge-green">Sharia Compliant</button>
        <button className="badge badge-blue">Israel Excluded</button>
        <button className="badge badge-gray">All Assets</button>
      </div>

      {/* Asset list placeholder */}
      <div className="card">
        <p className="text-sm text-muted-foreground">
          Asset screening engine loading...
        </p>
      </div>
    </div>
  );
}
