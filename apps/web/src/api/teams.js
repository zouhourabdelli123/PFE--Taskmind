import { api } from './axios';

export async function getTeams() {
  const { data } = await api.get('/api/v1/teams');
  return data.data;
}

export async function createTeam(payload) {
  const { data } = await api.post('/api/v1/teams', payload);
  return data.data;
}

export async function getTeam(teamId) {
  const { data } = await api.get(`/api/v1/teams/${teamId}`);
  return data.data;
}

export async function inviteOrAddMember(teamId, payload) {
  const { data } = await api.post(`/api/v1/teams/${teamId}/members`, payload);
  return data;
}

export async function updateMemberRole(teamId, userId, payload) {
  const { data } = await api.patch(`/api/v1/teams/${teamId}/members/${userId}`, payload);
  return data.data;
}

export async function removeMember(teamId, userId) {
  const { data } = await api.delete(`/api/v1/teams/${teamId}/members/${userId}`);
  return data;
}
