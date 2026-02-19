import axios from 'axios';
import { toast } from 'react-hot-toast';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

let onUnauthorized = () => {
  window.location.href = '/login';
};

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      onUnauthorized();
    }
    if (status === 403) {
      toast.error('Access denied');
    }
    return Promise.reject(error);
  },
);

export function extractError(error) {
  const payload = error?.response?.data;

  if (payload?.error?.details) {
    return {
      message: payload.error.message || 'Validation failed',
      details: payload.error.details,
    };
  }

  return {
    message: payload?.error?.message || 'Something went wrong',
    details: null,
  };
}
