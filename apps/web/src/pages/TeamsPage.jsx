import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createTeam, getTeams } from '../api/teams';
import { useActiveTeam } from '../context/TeamContext';

export function TeamsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setActiveTeamId } = useActiveTeam();
  const teamsQuery = useQuery({ queryKey: ['teams'], queryFn: getTeams });
  const createMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setActiveTeamId(team.id);
      navigate(`/teams/${team.id}`);
    },
  });

  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold">Teams</h2>
          <p className="text-slate-500">Select your active team or create a new one.</p>
        </div>
        <button className="btn-primary" onClick={() => createMutation.mutate({ name: `New Team ${Date.now()}` })}>
          Create Team
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(teamsQuery.data ?? []).map((team) => (
          <div key={team.id} className="card">
            <h3 className="text-lg font-bold">{team.name}</h3>
            <p className="mt-1 text-sm text-slate-500">Role: {team.current_user_role}</p>
            <div className="mt-4 flex gap-2">
              <Link className="btn-secondary" to={`/teams/${team.id}`}>Open</Link>
              <Link className="btn-secondary" to={`/teams/${team.id}/setup`}>Setup</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
