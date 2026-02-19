import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { extractError } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: register,
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
        <h2 className="text-2xl font-extrabold">Register</h2>
        <div><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
        <div><label className="label">Email</label><input className="input" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></div>
        <div><label className="label">Password</label><input type="password" className="input" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} /></div>
        <div><label className="label">Confirm Password</label><input type="password" className="input" value={form.password_confirmation} onChange={(e) => setForm((p) => ({ ...p, password_confirmation: e.target.value }))} /></div>
        {errors.form?.[0] && <p className="text-sm text-red-600">{errors.form[0]}</p>}
        <button className="btn-primary w-full" disabled={mutation.isPending}>{mutation.isPending ? 'Loading...' : 'Create account'}</button>
        <p className="text-sm text-slate-600">Already have an account? <Link className="text-blue-700" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
