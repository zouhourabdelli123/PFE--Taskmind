import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

let tokenGetter = () => null;

export function setTokenGetter(getter) {
  tokenGetter = getter;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenGetter();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiError(error) {
  const message = error?.response?.data?.message;
  const validation = error?.response?.data?.errors;
  const status = error?.response?.status;

  if (message) {
    return message;
  }

  if (validation && typeof validation === 'object') {
    const first = Object.values(validation)?.[0];
    if (Array.isArray(first) && first[0]) {
      return first[0];
    }
  }

  if (!error?.response) {
    return 'API unreachable. Check backend URL/CORS and ensure Laravel is running on http://localhost:8000.';
  }

  if (status === 401) {
    return 'Invalid credentials.';
  }

  if (status === 403) {
    return 'Access denied.';
  }

  if (status >= 500) {
    return 'Server error. Check Laravel logs.';
  }

  return 'Unexpected error. Please try again.';
}
