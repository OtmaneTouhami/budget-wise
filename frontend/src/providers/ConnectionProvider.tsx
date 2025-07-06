import React, { createContext, useState, useEffect, useContext } from "react";
import { checkApiConnection } from "../api/api-logger";

type ConnectionStatus = "connected" | "disconnected" | "checking";

interface ConnectionContextType {
  status: ConnectionStatus;
  lastChecked: Date | null;
  checkNow: () => Promise<boolean>;
}

const ConnectionContext = createContext<ConnectionContextType>({
  status: "checking",
  lastChecked: null,
  checkNow: async () => false,
});

export const useConnection = () => useContext(ConnectionContext);

interface ConnectionProviderProps {
  children: React.ReactNode;
  checkInterval?: number; // Check interval in milliseconds, default is 30 seconds
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({
  children,
  checkInterval = 30000,
}) => {
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async (): Promise<boolean> => {
    setStatus("checking");
    try {
      const isConnected = await checkApiConnection("/api/v1");
      setStatus(isConnected ? "connected" : "disconnected");
      setLastChecked(new Date());
      return isConnected;
    } catch (error) {
      console.error("Connection check failed:", error);
      setStatus("disconnected");
      setLastChecked(new Date());
      return false;
    }
  };

  useEffect(() => {
    // Initial check
    checkConnection();

    // Set up periodic checks
    const intervalId = setInterval(() => {
      checkConnection();
    }, checkInterval);

    return () => clearInterval(intervalId);
  }, [checkInterval]);

  const value = {
    status,
    lastChecked,
    checkNow: checkConnection,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

// Optional ConnectionStatus component to show in the UI
export const ConnectionStatus: React.FC = () => {
  const { status, checkNow } = useConnection();

  return (
    <div className="flex items-center space-x-2">
      {status === "connected" && (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
          API Connected
        </span>
      )}
      {status === "checking" && (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1 animate-pulse"></span>
          Checking Connection...
        </span>
      )}
      {status === "disconnected" && (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
          API Disconnected
          <button onClick={() => checkNow()} className="ml-2 text-xs underline">
            Try Again
          </button>
        </span>
      )}
    </div>
  );
};
