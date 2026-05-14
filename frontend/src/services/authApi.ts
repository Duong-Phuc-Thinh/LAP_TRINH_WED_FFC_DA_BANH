import apiClient from './apiClient';
import type { AuthResponse, User } from '../types';

export function loginApi(email: string, password: string) {
  return apiClient.post<AuthResponse>('/auth/login', { email, password }).then((res) => res.data);
}

export function registerApi(data: { fullName: string; email: string; password: string; phone?: string }) {
  return apiClient.post<AuthResponse>('/auth/register', data).then((res) => res.data);
}

export function meApi() {
  return apiClient.get<User>('/auth/me').then((res) => res.data);
}

