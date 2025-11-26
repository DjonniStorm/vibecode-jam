interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  telegram: string;
  password: string;
}

interface RegisterResponse {
  id: string;
  name: string;
  surname: string;
  email: string;
  telegram: string;
  registeredAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse };
