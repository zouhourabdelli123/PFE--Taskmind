import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getTeams } from '../api/teams';
import { useAuth } from '../context/AuthContext';
import { useActiveTeam } from '../context/TeamContext';

function TeamSwitcher() {
  const { activeTeamId, setActiveTeamId } = useActiveTeam();
  const teamsQuery = useQuery({ queryKey: ['teams'], queryFn: getTeams });

  return (
    <select
      className="input max-w-xs"
      value={activeTeamId ?? ''}
      onChange={(event) => setActiveTeamId(event.target.value)}
    >
      <option value="">Select team</option>
      {(teamsQuery.data ?? []).map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  );
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate('/login', { replace: true }),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-orange-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold text-blue-700">TaskMind RBAC</h1>
            <nav className="hidden gap-3 md:flex">
              <Link className="text-sm font-semibold text-slate-700 hover:text-blue-700" to="/teams">
                Teams
              </Link>
              <Link className="text-sm font-semibold text-slate-700 hover:text-blue-700" to="/dashboard">
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <TeamSwitcher />
            <span className="hidden text-sm text-slate-500 md:block">{user?.email}</span>
            <button className="btn-secondary" onClick={() => logoutMutation.mutate()}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
