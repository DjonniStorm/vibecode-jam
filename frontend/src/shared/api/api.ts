class Api {
  constructor(private readonly baseUrl: string) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async makeRequest<T>(url: string, options: RequestInit): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status >= 400) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    return response.json() as unknown as T;
  }

  public get<T, U extends T>(url: string): Promise<U> {
    return this.makeRequest<U>(url, { method: 'GET' });
  }

  public post<T, U>(url: string, body: T): Promise<U> {
    return this.makeRequest<U>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }) as Promise<U>;
  }

  public put<T, U extends T>(url: string, body: T): Promise<U> {
    return this.makeRequest<U>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public patch<T, U extends T>(url: string, body?: T): Promise<U> {
    return this.makeRequest<U>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T, U extends T>(url: string): Promise<U> {
    return this.makeRequest<U>(url, { method: 'DELETE' });
  }
}

export const api = new Api('http://localhost:9081');
