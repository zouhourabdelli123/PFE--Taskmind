import { apiClient } from './client';

export async function loginApi(payload) {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
}

export async function meApi() {
  const { data } = await apiClient.get('/auth/me');
  return data;
}

export async function logoutApi() {
  await apiClient.post('/auth/logout');
}
