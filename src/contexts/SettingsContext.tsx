/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface SettingsState {
  [key: string]: any;
}

interface SettingsContextType {
  settings: SettingsState;
  updateSetting: (settingId: string, value: any) => void;
  enableAccounts: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsState>({});

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  const updateSetting = (settingId: string, value: any) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        [settingId]: value,
      };
      // Save to localStorage
      localStorage.setItem("appSettings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const enableAccounts = settings.enable_accounts || false;

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        enableAccounts,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
