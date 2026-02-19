import { apiClient } from './client';

export async function listTasksApi() {
  const { data } = await apiClient.get('/tasks');
  return data.data ?? [];
}

export async function createTaskApi(payload) {
  const { data } = await apiClient.post('/tasks', payload);
  return data.data;
}

export async function updateTaskApi(id, payload) {
  const { data } = await apiClient.put(`/tasks/${id}`, payload);
  return data.data;
}

export async function deleteTaskApi(id) {
  await apiClient.delete(`/tasks/${id}`);
}
