import { createContext, useContext, useMemo, useState } from 'react';

const TeamContext = createContext(null);

const STORAGE_KEY = 'activeTeamId';

export function TeamProvider({ children }) {
  const [activeTeamId, setActiveTeamId] = useState(() => localStorage.getItem(STORAGE_KEY));

  const value = useMemo(
    () => ({
      activeTeamId,
      setActiveTeamId(nextId) {
        if (!nextId) {
          localStorage.removeItem(STORAGE_KEY);
          setActiveTeamId(null);
          return;
        }

        localStorage.setItem(STORAGE_KEY, String(nextId));
        setActiveTeamId(String(nextId));
      },
    }),
    [activeTeamId],
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useActiveTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useActiveTeam must be used inside TeamProvider');
  }
  return context;
}
