import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { extractError } from '../api/axios';
import { getTeam, inviteOrAddMember, removeMember, updateMemberRole } from '../api/teams';

export function TeamSetupPage() {
  const { teamId } = useParams();
  const queryClient = useQueryClient();
  const teamQuery = useQuery({ queryKey: ['team', teamId], queryFn: () => getTeam(teamId), enabled: Boolean(teamId) });
  const [form, setForm] = useState({ email: '', role: 'developer' });
  const [errors, setErrors] = useState({});

  const role = teamQuery.data?.current_user_role;
  const canManage = role === 'admin' || role === 'manager';

  const inviteMutation = useMutation({
    mutationFn: (payload) => inviteOrAddMember(teamId, payload),
    onSuccess: () => {
      setForm({ email: '', role: 'developer' });
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
    },
    onError: (error) => {
      const parsed = extractError(error);
      setErrors(parsed.details ?? { form: [parsed.message] });
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, nextRole }) => updateMemberRole(teamId, userId, { role: nextRole }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team', teamId] }),
  });

  const removeMutation = useMutation({
    mutationFn: (userId) => removeMember(teamId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team', teamId] }),
  });

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-extrabold">Team Setup</h2>
        <p className="text-slate-500">Members and invitations management.</p>
      </div>

      {canManage && (
        <form
          className="card grid gap-3 md:grid-cols-4"
          onSubmit={(event) => {
            event.preventDefault();
            setErrors({});
            inviteMutation.mutate(form);
          }}
        >
          <input className="input md:col-span-2" placeholder="member@email.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <select className="input" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="developer">developer</option>
            <option value="viewer">viewer</option>
          </select>
          <button className="btn-primary" disabled={inviteMutation.isPending}>Invite/Add</button>
          {errors.form?.[0] && <p className="text-sm text-red-600 md:col-span-4">{errors.form[0]}</p>}
        </form>
      )}

      <div className="card">
        <h3 className="mb-3 text-lg font-bold">Members</h3>
        <div className="space-y-2">
          {(teamQuery.data?.members ?? []).map((member) => (
            <div key={member.id} className="flex flex-col justify-between gap-2 rounded-lg border border-slate-200 p-3 md:flex-row md:items-center">
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-slate-500">{member.email}</p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase">{member.role}</span>
                {canManage && (
                  <>
                    <select className="input" value={member.role} onChange={(e) => changeRoleMutation.mutate({ userId: member.id, nextRole: e.target.value })}>
                      <option value="admin">admin</option>
                      <option value="manager">manager</option>
                      <option value="developer">developer</option>
                      <option value="viewer">viewer</option>
                    </select>
                    <button className="btn-secondary" onClick={() => removeMutation.mutate(member.id)}>Remove</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3 text-lg font-bold">Pending Invitations</h3>
        <div className="space-y-2">
          {(teamQuery.data?.pending_invitations ?? []).map((inv) => (
            <div key={inv.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p>{inv.email} - <span className="font-semibold">{inv.role}</span></p>
              <p className="text-slate-500">Token: {inv.token}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
