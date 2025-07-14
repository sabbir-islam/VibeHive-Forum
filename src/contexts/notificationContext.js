import { createContext, useContext } from "react";

// Export NotificationContext as a named export
export const NotificationContext = createContext();

// Optional: Create a custom hook for easier usage
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
