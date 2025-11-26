class Api {
  constructor(private readonly baseUrl: string) {}

  private async makeRequest<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, options);
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

  public post<T, U extends T>(url: string, body: T): Promise<U> {
    return this.makeRequest<U>(url, { method: 'POST', body: JSON.stringify(body) });
  }

  public put<T, U extends T>(url: string, body: T): Promise<U> {
    return this.makeRequest<U>(url, { method: 'PUT', body: JSON.stringify(body) });
  }

  public delete<T, U extends T>(url: string): Promise<U> {
    return this.makeRequest<U>(url, { method: 'DELETE' });
  }
}

export const api = new Api('http://localhost:3000');
