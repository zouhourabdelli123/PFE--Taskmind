import { api } from './axios';

export async function getProjects(teamId) {
  const { data } = await api.get(`/api/v1/teams/${teamId}/projects`);
  return data.data;
}

export async function createProject(teamId, payload) {
  const { data } = await api.post(`/api/v1/teams/${teamId}/projects`, payload);
  return data.data;
}
