import { api } from '@shared/api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../model/types';

class AuthApi {
  private readonly api: typeof api;

  constructor(private readonly prefix: string) {
    this.api = api;
  }

  register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.api.post<RegisterRequest, RegisterResponse>(`${this.prefix}/auth/register`, data);
  }

  login(data: LoginRequest): Promise<LoginResponse> {
    return this.api.post<LoginRequest, LoginResponse>(`${this.prefix}/auth/login`, data);
  }
}

export const authApi = new AuthApi('/api');
