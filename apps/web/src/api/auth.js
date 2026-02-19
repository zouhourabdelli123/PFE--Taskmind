import { api } from './axios';

export async function csrf() {
  await api.get('/sanctum/csrf-cookie');
}

export async function register(payload) {
  await csrf();
  const { data } = await api.post('/api/v1/auth/register', payload);
  return data.data;
}

export async function login(payload) {
  await csrf();
  const { data } = await api.post('/api/v1/auth/login', payload);
  return data.data;
}

export async function me() {
  const { data } = await api.get('/api/v1/auth/me');
  return data.data;
}

export async function logout() {
  await api.post('/api/v1/auth/logout');
}
