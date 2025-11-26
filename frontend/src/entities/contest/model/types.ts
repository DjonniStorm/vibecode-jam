interface Contest {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive';
}

interface Task {
  id: string;
  name: string;
}

export type { Contest, Task };
