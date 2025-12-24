import optionsSchema from "@/lib/options_schema.json";
import { debugLog, debugError, setDebugMode } from "./debug";

interface SettingsState {
  [key: string]: any;
}

export const loadSettings = async (
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>
): Promise<void> => {
  debugLog("Starting loadSettings function");

  // Initialize settings with default values from schema
  const defaultSettings: SettingsState = {};

  // Load defaults from both frontend and sections
  if (optionsSchema.frontend) {
    optionsSchema.frontend.forEach((section) => {
      section.settings.forEach((setting) => {
        defaultSettings[setting.id] = setting.default;
      });
    });
  }

  if (optionsSchema.sections) {
    optionsSchema.sections.forEach((section) => {
      section.settings.forEach((setting) => {
        defaultSettings[setting.id] = setting.default;
      });
    });
  }

  debugLog("Default settings initialized", defaultSettings);

  try {
    debugLog("Attempting to fetch config from new API");

    // Get all configs from the new unified API
    const response = await fetch("http://localhost:3001/api/config");
    let configData: any = {};

    if (response.ok) {
      configData = await response.json();
      debugLog("Config data received from new API", configData);

      // Flatten all section configs into a single settings object
      const flattenedSettings: SettingsState = {};

      Object.keys(configData).forEach((section) => {
        const sectionData = configData[section];
        Object.keys(sectionData).forEach((key) => {
          flattenedSettings[key] = sectionData[key];
        });
      });

      // Set debug mode if available
      setDebugMode(flattenedSettings.debug || false);

      const finalSettings = { ...defaultSettings, ...flattenedSettings };
      debugLog("Final settings to apply", finalSettings);
      setSettings(finalSettings);
      debugLog("Settings loaded successfully from new API");
      return;
    } else {
      debugLog("Config API failed, falling back to localStorage");
    }
  } catch (error) {
    debugError("Could not load from API, falling back to localStorage", error);
  }

  debugLog("Falling back to localStorage");
  // Fallback to localStorage
  const savedSettings = localStorage.getItem("appSettings");
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      debugLog("Settings found in localStorage", parsed);
      const finalSettings = { ...defaultSettings, ...parsed };
      setDebugMode(finalSettings.debug || false);
      setSettings(finalSettings);
      debugLog("Settings loaded successfully from localStorage");
    } catch (error) {
      debugError("Failed to parse saved settings", error);
      setDebugMode(defaultSettings.debug || false);
      setSettings(defaultSettings);
      debugLog("Using default settings due to parse error");
    }
  } else {
    debugLog("No settings found in localStorage, using defaults");
    setDebugMode(defaultSettings.debug || false);
    setSettings(defaultSettings);
    debugLog("Default settings applied");
  }
};
