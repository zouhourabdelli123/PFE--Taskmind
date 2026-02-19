import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../api/dashboard';

export function useTeamRole(teamId) {
  return useQuery({
    queryKey: ['dashboard', teamId],
    queryFn: () => getDashboard(teamId),
    enabled: Boolean(teamId),
    select: (data) => data.role,
  });
}
