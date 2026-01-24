/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

interface SettingsState {
  [key: string]: any;
}

// Mappatura delle sezioni ai file di configurazione
const CONFIG_FILES: Record<string, string> = {
  "frontend-general": "frontend-general-config.json",
  "backend-general": "backend-general-config.json",
  storage: "storage-config.json",
  downloader: "downloader-config.json",
  conversion: "conversion-config.json",
  external_services: "external_services-config.json",
  network: "network-config.json",
  hooks: "hooks-config.json",
  site_login: "site_login-config.json",
  apis: "apis-config.json",
};

// Mappatura delle impostazioni alle sezioni
const SETTING_TO_SECTION: Record<string, string> = {
  // Frontend general
  debug: "frontend-general",
  show_message: "frontend-general",
  show_trending: "frontend-general",
  enable_accounts: "frontend-general",
  enable_queue: "frontend-general",
  // Backend general
  fetch_domain_online: "backend-general",
  bypass_dns: "backend-general",
  // Storage
  root_path: "storage",
  movie_folder_name: "storage",
  serie_folder_name: "storage",
  anime_folder_name: "storage",
  map_episode_name: "storage",
  add_siteName: "storage",
  cleanup_tmp_folder: "storage",
  // Downloader
  default_video_workers: "downloader",
  default_audio_workers: "downloader",
  segment_timeout: "downloader",
  enable_retry: "downloader",
  specific_list_audio: "downloader",
  download_subtitle: "downloader",
  merge_subs: "downloader",
  specific_list_subtitles: "downloader",
  limit_segment: "downloader",
  cleanup_tmp_folder_download: "downloader",
  get_only_link: "downloader",
  // Conversion
  use_gpu: "conversion",
  force_resolution: "conversion",
  extension: "conversion",
  default_preset: "conversion",
  use_codec: "conversion",
  use_vcodec: "conversion",
  use_acodec: "conversion",
  use_bitrate: "conversion",
  param_video: "conversion",
  param_audio: "conversion",
  param_subtitles: "conversion",
  param_final: "conversion",
  // External services
  telegram_bot: "external_services",
  qbit_host: "external_services",
  qbit_port: "external_services",
  qbit_user: "external_services",
  qbit_pass: "external_services",
  // Network
  verify: "network",
  timeout: "network",
  max_retry: "network",
  // Hooks
  pre_run: "hooks",
  post_run: "hooks",
  // Site login
  crunchyroll: "site_login",
  // APIs
  tmdb_api_key: "apis",
  tmdb_base_url: "apis",
};

/**
 * Groups settings by section for saving to separate config files
 */
export const groupSettingsBySection = (
  settings: SettingsState,
): Record<string, SettingsState> => {
  const groupedSettings: Record<string, SettingsState> = {};

  // Initialize all sections
  Object.keys(CONFIG_FILES).forEach((section) => {
    groupedSettings[section] = {};
  });

  // Group settings by section
  Object.keys(settings).forEach((settingId) => {
    const section = SETTING_TO_SECTION[settingId];
    if (section && settings[settingId] !== undefined) {
      groupedSettings[section][settingId] = settings[settingId];
    }
  });

  return groupedSettings;
};

/**
 * Updates all config files with new settings
 */
export const updateConfigFiles = async (
  settings: SettingsState,
): Promise<boolean> => {
  try {
    const groupedSettings = groupSettingsBySection(settings);

    // Update each config file separately
    const updatePromises = Object.entries(groupedSettings).map(
      async ([section, sectionSettings]) => {
        if (Object.keys(sectionSettings).length === 0) return true;

        const fileName = CONFIG_FILES[section];
        const response = await fetch(
          `http://localhost:3001/api/config/${section}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sectionSettings),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to update ${fileName}`);
        }

        return true;
      },
    );

    await Promise.all(updatePromises);

    toast.success("Configurazioni salvate con successo!");
    return true;
  } catch (error) {
    console.error("Error updating config files:", error);
    toast.error(
      "Errore durante il salvataggio delle configurazioni. Assicurati che il server sia in esecuzione.",
    );
    return false;
  }
};

/**
 * Alternative implementation for development without backend
 */
export const updateConfigFilesDev = async (
  settings: SettingsState,
): Promise<boolean> => {
  try {
    const groupedSettings = groupSettingsBySection(settings);

    // Save each section to localStorage
    Object.entries(groupedSettings).forEach(([section, sectionSettings]) => {
      if (Object.keys(sectionSettings).length > 0) {
        const fileName = CONFIG_FILES[section];
        localStorage.setItem(fileName, JSON.stringify(sectionSettings));
      }
    });

    toast.info(
      "Configurazioni salvate localmente. Per salvare nei file è necessario un backend.",
      {
        duration: 5000,
      },
    );

    console.log("Config data that would be saved:", groupedSettings);
    return true;
  } catch (error) {
    console.error("Error saving configs locally:", error);
    toast.error("Errore durante il salvataggio delle configurazioni");
    return false;
  }
};

// Backwards compatibility
export const updateConfigFile = updateConfigFiles;
export const updateConfigFileDev = updateConfigFilesDev;
