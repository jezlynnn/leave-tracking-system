import { api } from './api';
import { ApiResponse, User, LoginInput } from '../types';

export const authService = {
  async login(input: LoginInput): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>('/auth/login', input);
    return data.data!;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async me(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data!;
  },
};
