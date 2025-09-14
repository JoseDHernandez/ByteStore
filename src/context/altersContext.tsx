"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import Alert, { AlertProps } from "@/components/alert";

export type AlertData = Omit<AlertProps, "onClose"> & { id: number };

interface AlertsContextProps {
  addAlert: (text: string, type: AlertProps["type"], duration?: number) => void;
}

const AlertsContext = createContext<AlertsContextProps | undefined>(undefined);

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts debe usarse dentro de AlertsProvider");
  return ctx;
}

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const addAlert = (
    text: string,
    type: AlertProps["type"],
    duration: number = 5000 //5s
  ) => {
    const id = Date.now() + Math.random(); // id único
    setAlerts((prev) => [...prev, { id, text, type }]);

    // autoremover después de `duration`
    setTimeout(() => {
      removeAlert(id);
    }, duration);
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AlertsContext.Provider value={{ addAlert }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-xs">
        {alerts.map((a) => (
          <Alert key={a.id} {...a} onClose={() => removeAlert(a.id)} />
        ))}
      </div>
    </AlertsContext.Provider>
  );
}
