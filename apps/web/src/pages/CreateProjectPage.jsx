import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProject } from '../api/projects';
import { extractError } from '../api/axios';
import { useTeamRole } from '../hooks/useTeamRole';

export function CreateProjectPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const roleQuery = useTeamRole(teamId);
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  const role = roleQuery.data;
  const canCreate = role === 'admin' || role === 'manager';

  const mutation = useMutation({
    mutationFn: (payload) => createProject(teamId, payload),
    onSuccess: () => navigate(`/teams/${teamId}`),
    onError: (error) => {
      const parsed = extractError(error);
      setErrors(parsed.details ?? { form: [parsed.message] });
    },
  });

  if (roleQuery.isLoading) {
    return <div className="text-slate-500">Loading...</div>;
  }

  if (!canCreate) {
    return <div className="card text-red-600">Access denied.</div>;
  }

  return (
    <form
      className="card mx-auto max-w-2xl space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setErrors({});
        mutation.mutate(form);
      }}
    >
      <h2 className="text-2xl font-extrabold">Create Project</h2>
      <div>
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input" rows="4" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
      </div>
      {errors.form?.[0] && <p className="text-sm text-red-600">{errors.form[0]}</p>}
      <button className="btn-primary" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Create'}</button>
    </form>
  );
}
