import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getTeam } from '../api/teams';
import { getProjects } from '../api/projects';
import { useActiveTeam } from '../context/TeamContext';

export function TeamDetailPage() {
  const { teamId } = useParams();
  const { setActiveTeamId } = useActiveTeam();

  useEffect(() => {
    setActiveTeamId(teamId);
  }, [teamId, setActiveTeamId]);

  const teamQuery = useQuery({ queryKey: ['team', teamId], queryFn: () => getTeam(teamId), enabled: Boolean(teamId) });
  const projectsQuery = useQuery({ queryKey: ['projects', teamId], queryFn: () => getProjects(teamId), enabled: Boolean(teamId) });

  const role = teamQuery.data?.current_user_role;
  const canManage = role === 'admin' || role === 'manager';

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">{teamQuery.data?.name ?? 'Team'}</h2>
          <p className="text-slate-500">Role: {role}</p>
        </div>
        {canManage && <Link className="btn-primary" to={`/teams/${teamId}/projects/new`}>Create Project</Link>}
      </div>
      <div className="card">
        <h3 className="mb-3 text-lg font-bold">Projects</h3>
        <div className="space-y-2">
          {(projectsQuery.data ?? []).map((project) => (
            <div key={project.id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-semibold">{project.name}</p>
              <p className="text-sm text-slate-500">{project.description || '-'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
