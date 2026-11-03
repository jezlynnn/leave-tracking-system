import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../types';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      // Redirect to login on session expiry if not already there
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiResponse;
    return data.message ?? 'An unexpected error occurred';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
