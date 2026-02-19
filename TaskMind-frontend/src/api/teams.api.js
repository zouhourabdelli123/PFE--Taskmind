import { apiClient } from './client';

export async function listTeamsApi() {
  const { data } = await apiClient.get('/teams');
  return data.data ?? [];
}

export async function createTeamApi(payload) {
  const { data } = await apiClient.post('/teams', payload);
  return data.data;
}

export async function updateTeamApi(id, payload) {
  const { data } = await apiClient.put(`/teams/${id}`, payload);
  return data.data;
}

export async function deleteTeamApi(id) {
  await apiClient.delete(`/teams/${id}`);
}
