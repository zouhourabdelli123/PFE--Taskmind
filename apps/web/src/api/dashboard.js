import { api } from './axios';

export async function getDashboard(teamId) {
  const { data } = await api.get(`/api/v1/dashboard?team_id=${teamId}`);
  return data.data;
}
