import { apiClient } from './client';

export async function listProjectsApi() {
  const { data } = await apiClient.get('/projects');
  return data.data ?? [];
}

export async function createProjectApi(payload) {
  const { data } = await apiClient.post('/projects', payload);
  return data.data;
}

export async function updateProjectApi(id, payload) {
  const { data } = await apiClient.put(`/projects/${id}`, payload);
  return data.data;
}

export async function deleteProjectApi(id) {
  await apiClient.delete(`/projects/${id}`);
}
