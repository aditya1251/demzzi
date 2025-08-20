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
  const [contactDetails, setContactDetails] = useState<{
    phone?: string;
    WhatsApp?: string;
  }>({});

  useEffect(() => {
    fetch("/api/contact-details")
      .then((res) => res.json())
      .then((data) => {
        setContactDetails({
          phone: data?.phone || "",
          WhatsApp: data?.WhatsApp || "",
        });
      });
  }, []);
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
        <>
          {children}
          <a
            href={`https://wa.me/${
              contactDetails.WhatsApp
            }?text=${encodeURIComponent(
              "Hello, I’m interested in your services. Could you provide more details?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 z-50 md:bottom-6 p-1 right-4 md:right-6 bg-green-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition">
            <img src="/whatsapp.png" alt="WhatsApp" />
          </a>
        </>
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
