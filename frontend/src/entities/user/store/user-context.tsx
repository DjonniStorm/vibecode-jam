import { createContext, useState, useMemo, type PropsWithChildren } from 'react';
import type { User } from '../model/types';
import { useMe } from '../hooks/use-user';
import { isAuthenticated } from '@entities/auth';

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

const UserProvider = ({ children }: PropsWithChildren) => {
  const { data: me, isLoading } = useMe();
  const authenticated = isAuthenticated();
  const [manualUser, setManualUser] = useState<User | null>(null);

  const user = useMemo(() => {
    if (manualUser) {
      return manualUser;
    }
    if (me && typeof me === 'object' && !isLoading) {
      return me;
    }
    if (!authenticated && !isLoading) {
      return null;
    }
    return null;
  }, [me, isLoading, authenticated, manualUser]);

  return (
    <UserContext.Provider value={{ user, isLoading, setUser: setManualUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext, type UserContextValue };
