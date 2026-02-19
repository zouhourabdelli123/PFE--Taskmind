function StatCard({ label, value }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

export function AdminDashboard({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Members" value={stats.members_count} />
      <StatCard label="Projects" value={stats.projects_count} />
      <StatCard label="Pending invitations" value={stats.pending_invitations_count} />
      <StatCard label="Owned projects" value={stats.owned_projects_count} />
    </div>
  );
}
