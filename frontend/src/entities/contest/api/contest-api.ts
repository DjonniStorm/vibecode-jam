import { api } from '@shared/api';
import type { Contest } from '../model/types';

class ContestApi {
  private readonly api: typeof api;

  constructor(private readonly prefix: string) {
    this.api = api;
  }

  getContests(): Promise<Contest[]> {
    return this.api.get(`${this.prefix}/contests`);
  }

  getContest(id: string): Promise<Contest> {
    return this.api.get(`${this.prefix}/contests/${id}`);
  }
}

export const contestApi = new ContestApi('/contest');
