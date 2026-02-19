import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { extractError } from '../api/axios';
import { acceptInvitation } from '../api/invitations';
import { useActiveTeam } from '../context/TeamContext';

export function InviteAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setActiveTeamId } = useActiveTeam();
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => acceptInvitation(token),
    onSuccess: (team) => {
      setActiveTeamId(team.id);
      navigate(`/teams/${team.id}`);
    },
    onError: (err) => setError(extractError(err).message),
  });

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="card">
        <h2 className="text-2xl font-extrabold">Accept Invitation</h2>
        <p className="text-slate-500">Token: {token}</p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button className="btn-primary mt-4" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? 'Accepting...' : 'Accept'}
        </button>
      </div>
    </div>
  );
}
