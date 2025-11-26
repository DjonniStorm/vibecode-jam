import { useContext } from 'react';
import { ContestStoreContext } from '../store/contest.store';
import type { ContestStore } from '../model/types';

export const useContestStore = (): ContestStore => {
  const context = useContext(ContestStoreContext);
  if (!context) {
    throw new Error('useContestStore must be used within a ContestStoreProvider');
  }
  return context;
};
