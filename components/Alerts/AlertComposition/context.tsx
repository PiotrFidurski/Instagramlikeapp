import * as React from "react";
import { AlertRoot } from "./AlertRoot";

interface CreateAlertProps {
  isActive?: boolean;
  onUndo?: () => void;
  timeout: number;
  value?: string | string[];
}

export interface AlertProps extends CreateAlertProps {
  id: string;
  timeOutId: NodeJS.Timeout;
  key: string;
}

interface AlertContextProps {
  alerts: Array<AlertProps>;
  createAlert: (key: string, props: CreateAlertProps) => void;
  dismiss: (alertId: string) => void;
}

const AlertContext = React.createContext<AlertContextProps | null>(null);

const AlertProvider: React.FC = ({ children }) => {
  const [alerts, setAlerts] = React.useState<Array<AlertProps>>([]);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const createAlert = React.useCallback(
    (key: string, props: CreateAlertProps) => {
      const id = Math.random()
        .toString(36)
        .substr(2, 9);

      if (props.timeout) {
        timeoutRef.current = setTimeout(() => {
          setAlerts((currentAlerts) =>
            currentAlerts.filter((alert) => alert.id !== id)
          );
        }, props.timeout);
      }

      setAlerts((currentAlerts) => [
        ...currentAlerts,
        { key, id, timeOutId: timeoutRef?.current!, ...props },
      ]);
    },
    []
  );

  const dismiss = React.useCallback((alertId: string) => {
    setAlerts((currentAlerts) =>
      currentAlerts.filter((alert) => alert.id !== alertId)
    );
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, createAlert, dismiss }}>
      <AlertRoot selector="#portal" children={alerts} />
      {children}
    </AlertContext.Provider>
  );
};

const useAlert = () => {
  const context = React.useContext(AlertContext)!;
  if (!context)
    throw new Error(
      "You are using AlertContext outside of AlertProvider, try wrapping your component in AlertProvider."
    );

  return context;
};

export { AlertProvider, useAlert };
