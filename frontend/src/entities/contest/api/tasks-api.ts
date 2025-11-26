import { api } from '@shared/api';
import type { Task } from '../model/types';

class TasksApi {
  private readonly api: typeof api;

  constructor(private readonly prefix: string) {
    this.api = api;
  }

  getTasks(contestId: string): Promise<Task[]> {
    return this.api.get(`${this.prefix}/tasks/${contestId}`);
  }

  getTask(id: string): Promise<Task> {
    return this.api.get(`${this.prefix}/tasks/${id}`);
  }
}

export const tasksApi = new TasksApi('/tasks');
