import { api } from '@shared/api';
import type { User } from '../model/types';

class UserApi {
  private readonly api: typeof api;

  constructor(private readonly prefix: string) {
    this.api = api;
  }

  getUsers(): Promise<User[]> {
    return this.api.get(`${this.prefix}/users`);
  }

  getUser(id: string): Promise<User> {
    return this.api.get(`${this.prefix}/users/${id}`);
  }

  createUser(user: UserCreate): Promise<User> {
    return this.api.post(`${this.prefix}/users`, user);
  }

  updateUser(id: string, user: User): Promise<User> {
    return this.api.put(`${this.prefix}/users/${id}`, user);
  }
}

export const userApi = new UserApi('uesr');
