function StatCard({ label, value }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

export function ViewerDashboard({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard label="Readable projects" value={stats.projects_count} />
      <StatCard label="Team members" value={stats.members_count} />
    </div>
  );
}
