import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { extractError } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate('/teams', { replace: true }),
    onError: (error) => {
      const parsed = extractError(error);
      setErrors(parsed.details ?? { form: [parsed.message] });
    },
  });

  const submit = (event) => {
    event.preventDefault();
    setErrors({});
    mutation.mutate(form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4">
        <h2 className="text-2xl font-extrabold">Login</h2>
        <div>
          <label className="label">Email</label>
          <input className="input" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          {errors.email?.[0] && <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>}
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" className="input" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          {errors.password?.[0] && <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>}
        </div>
        {errors.form?.[0] && <p className="text-sm text-red-600">{errors.form[0]}</p>}
        <button className="btn-primary w-full" disabled={mutation.isPending}>{mutation.isPending ? 'Loading...' : 'Login'}</button>
        <p className="text-sm text-slate-600">No account? <Link className="text-blue-700" to="/register">Register</Link></p>
      </form>
    </div>
  );
}
