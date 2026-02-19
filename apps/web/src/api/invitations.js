import { api } from './axios';

export async function acceptInvitation(token) {
  const { data } = await api.post('/api/v1/invitations/accept', { token });
  return data.data;
}
