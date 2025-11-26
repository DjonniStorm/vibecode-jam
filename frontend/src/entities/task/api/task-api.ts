import { api } from '@shared/api';
import type { Task, TaskRequest, TaskResponse, TaskUpdateRequest } from '../model/types';

class TaskApi {
  private readonly api: typeof api;

  constructor(private readonly prefix: string) {
    this.api = api;
  }

  createTask(data: TaskRequest): Promise<TaskResponse> {
    return this.api.post<TaskRequest, TaskResponse>(`${this.prefix}/`, data);
  }

  updateTask(taskId: string, data: TaskUpdateRequest): Promise<Task> {
    return this.api.patch<TaskUpdateRequest, Task>(`${this.prefix}/${taskId}`, data);
  }

  getTasksByInterview(interviewId: string): Promise<Task[]> {
    return this.api.get<Task[], Task[]>(`${this.prefix}/interview/${interviewId}`);
  }
}

export const taskApi = new TaskApi('/api/tasks');
