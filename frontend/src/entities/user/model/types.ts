interface UserCreate {
  name: string;
  surname: string;
  email: string;
  telegram: string;
}

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  telegram: string;
}

export type { UserCreate, User };
