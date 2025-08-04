"use client";

import { SessionProvider } from "next-auth/react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AppContextType {
  hasSeenSplash: boolean;
  setHasSeenSplash: (seen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasSeenSplash, setHasSeenSplash] = useState(false);

  useEffect(() => {
    const seenSplash = sessionStorage.getItem("hasSeenSplash");
    if (seenSplash === "true") {
      setHasSeenSplash(true);
    }
  }, []);

  const updateHasSeenSplash = (seen: boolean) => {
    setHasSeenSplash(seen);
    sessionStorage.setItem("hasSeenSplash", seen.toString());
  };

  return (
    <SessionProvider>
      <AppContext.Provider
        value={{ hasSeenSplash, setHasSeenSplash: updateHasSeenSplash }}>
        {children}
      </AppContext.Provider>
    </SessionProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
