import { api } from '@shared/api';
import type { User, UserStats } from '../model/types';

class UserApi {
  private readonly api: typeof api;

  constructor(private readonly prefix: string) {
    this.api = api;
  }

  getMe(): Promise<User> {
    return this.api.get<User, User>(`${this.prefix}/me`);
  }

  getMyStats(): Promise<UserStats> {
    return this.api.get<UserStats, UserStats>(`${this.prefix}/me/stats`);
  }

  // Admin endpoints
  getUsers(): Promise<User[]> {
    return this.api.get<User[], User[]>(`${this.prefix}`);
  }

  getUser(id: string): Promise<User> {
    return this.api.get<User, User>(`${this.prefix}/${id}`);
  }

  getUserStats(id: string): Promise<UserStats> {
    return this.api.get<UserStats, UserStats>(`${this.prefix}/${id}/stats`);
  }
}

export const userApi = new UserApi('/api/users');
