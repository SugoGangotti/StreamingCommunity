let debugMode = false;

export const setDebugMode = (enabled: boolean) => {
  debugMode = enabled;
};

export const isDebugEnabled = (): boolean => {
  return debugMode;
};

export const debugLog = (message: string, data?: any) => {
  if (debugMode) {
    console.log(`[DEBUG] ${message}`, data || "");
  }
};

export const debugError = (message: string, error?: any) => {
  if (debugMode) {
    console.error(`[DEBUG ERROR] ${message}`, error || "");
  }
};
