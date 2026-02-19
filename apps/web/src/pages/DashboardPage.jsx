import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { getDashboard } from '../api/dashboard';
import { useActiveTeam } from '../context/TeamContext';
import { AdminDashboard } from '../features/dashboards/AdminDashboard';
import { ManagerDashboard } from '../features/dashboards/ManagerDashboard';
import { DeveloperDashboard } from '../features/dashboards/DeveloperDashboard';
import { ViewerDashboard } from '../features/dashboards/ViewerDashboard';

export function DashboardPage() {
  const { activeTeamId } = useActiveTeam();

  const dashboardQuery = useQuery({
    queryKey: ['dashboard', activeTeamId],
    queryFn: () => getDashboard(activeTeamId),
    enabled: Boolean(activeTeamId),
  });

  useEffect(() => {
    if (!activeTeamId) {
      localStorage.removeItem('activeTeamId');
    }
  }, [activeTeamId]);

  if (!activeTeamId) {
    return <Navigate to="/teams" replace />;
  }

  if (dashboardQuery.isLoading) {
    return <div className="text-slate-500">Loading dashboard...</div>;
  }

  const payload = dashboardQuery.data;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-extrabold">Dashboard</h2>
        <p className="text-slate-500">Team #{payload.team_id} - Role {payload.role}</p>
      </div>

      {payload.role === 'admin' && <AdminDashboard stats={payload.stats} />}
      {payload.role === 'manager' && <ManagerDashboard stats={payload.stats} />}
      {payload.role === 'developer' && <DeveloperDashboard stats={payload.stats} />}
      {payload.role === 'viewer' && <ViewerDashboard stats={payload.stats} />}
    </div>
  );
}
