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
  optionsSchema.sections.forEach((section) => {
    section.settings.forEach((setting) => {
      defaultSettings[setting.id] = setting.default;
    });
  });
  debugLog("Default settings initialized", defaultSettings);

  try {
    debugLog("Attempting to fetch config from API");
    // Try to get settings from config.json via API
    const response = await fetch("http://localhost:3001/api/config");
    if (response.ok) {
      const configData = await response.json();
      debugLog("Config data received from API", configData);

      // Set debug mode based on config
      setDebugMode(configData.DEFAULT?.debug || false);

      // Map config.json to UI settings format
      const mappedSettings = {
        debug: configData.DEFAULT?.debug || defaultSettings.debug,
        show_message:
          configData.DEFAULT?.show_message || defaultSettings.show_message,
        show_trending:
          configData.DEFAULT?.show_trending || defaultSettings.show_trending,
        fetch_domain_online:
          configData.DEFAULT?.fetch_domain_online ||
          defaultSettings.fetch_domain_online,
        telegram_bot:
          configData.DEFAULT?.telegram_bot || defaultSettings.telegram_bot,
        bypass_dns:
          configData.DEFAULT?.bypass_dns || defaultSettings.bypass_dns,
        root_path:
          configData.OUT_FOLDER?.root_path || defaultSettings.root_path,
        movie_folder_name:
          configData.OUT_FOLDER?.movie_folder_name ||
          defaultSettings.movie_folder_name,
        serie_folder_name:
          configData.OUT_FOLDER?.serie_folder_name ||
          defaultSettings.serie_folder_name,
        anime_folder_name:
          configData.OUT_FOLDER?.anime_folder_name ||
          defaultSettings.anime_folder_name,
        map_episode_name:
          configData.OUT_FOLDER?.map_episode_name ||
          defaultSettings.map_episode_name,
        add_siteName:
          configData.OUT_FOLDER?.add_siteName || defaultSettings.add_siteName,
        cleanup_tmp_folder:
          configData.OUT_FOLDER?.cleanup_tmp_folder ||
          defaultSettings.cleanup_tmp_folder,
        default_video_workers:
          configData.M3U8_DOWNLOAD?.default_video_workers ||
          defaultSettings.default_video_workers,
        default_audio_workers:
          configData.M3U8_DOWNLOAD?.default_audio_workers ||
          defaultSettings.default_audio_workers,
        segment_timeout:
          configData.M3U8_DOWNLOAD?.segment_timeout ||
          defaultSettings.segment_timeout,
        enable_retry:
          configData.M3U8_DOWNLOAD?.enable_retry ||
          defaultSettings.enable_retry,
        specific_list_audio:
          configData.M3U8_DOWNLOAD?.specific_list_audio ||
          defaultSettings.specific_list_audio,
        get_only_link:
          configData.M3U8_DOWNLOAD?.get_only_link ||
          defaultSettings.get_only_link,
        download_subtitle:
          configData.M3U8_DOWNLOAD?.download_subtitle ||
          defaultSettings.download_subtitle,
        merge_subs:
          configData.M3U8_DOWNLOAD?.merge_subs || defaultSettings.merge_subs,
        specific_list_subtitles:
          configData.M3U8_DOWNLOAD?.specific_list_subtitles ||
          defaultSettings.specific_list_subtitles,
        limit_segment:
          configData.M3U8_DOWNLOAD?.limit_segment ||
          defaultSettings.limit_segment,
        cleanup_tmp_folder_download:
          configData.M3U8_DOWNLOAD?.cleanup_tmp_folder ||
          defaultSettings.cleanup_tmp_folder_download,
        use_gpu: configData.M3U8_CONVERSION?.use_gpu || defaultSettings.use_gpu,
        force_resolution:
          configData.M3U8_CONVERSION?.force_resolution ||
          defaultSettings.force_resolution,
        extension:
          configData.M3U8_CONVERSION?.extension || defaultSettings.extension,
        default_preset:
          configData.M3U8_CONVERSION?.default_preset ||
          defaultSettings.default_preset,
        use_codec:
          configData.M3U8_CONVERSION?.use_codec || defaultSettings.use_codec,
        use_vcodec:
          configData.M3U8_CONVERSION?.use_vcodec || defaultSettings.use_vcodec,
        use_acodec:
          configData.M3U8_CONVERSION?.use_acodec || defaultSettings.use_acodec,
        use_bitrate:
          configData.M3U8_CONVERSION?.use_bitrate ||
          defaultSettings.use_bitrate,
        param_video:
          configData.M3U8_CONVERSION?.param_video?.join(" ") ||
          defaultSettings.param_video,
        param_audio:
          configData.M3U8_CONVERSION?.param_audio?.join(" ") ||
          defaultSettings.param_audio,
        param_subtitles:
          configData.M3U8_CONVERSION?.param_subtitles?.join(" ") ||
          defaultSettings.param_subtitles,
        param_final:
          configData.M3U8_CONVERSION?.param_final?.join(" ") ||
          defaultSettings.param_final,
        qbit_host: configData.QBIT_CONFIG?.host || defaultSettings.qbit_host,
        qbit_port: configData.QBIT_CONFIG?.port || defaultSettings.qbit_port,
        qbit_user: configData.QBIT_CONFIG?.user || defaultSettings.qbit_user,
        qbit_pass: configData.QBIT_CONFIG?.pass || defaultSettings.qbit_pass,
        verify: configData.REQUESTS?.verify || defaultSettings.verify,
        timeout: configData.REQUESTS?.timeout || defaultSettings.timeout,
        max_retry: configData.REQUESTS?.max_retry || defaultSettings.max_retry,
        pre_run: configData.HOOKS?.pre_run?.[0] || defaultSettings.pre_run,
        post_run: configData.HOOKS?.post_run?.[0] || defaultSettings.post_run,
        crunchyroll_etp_rt:
          configData.SITE_LOGIN?.crunchyroll?.etp_rt ||
          defaultSettings.crunchyroll_etp_rt,
        crunchyroll_x_cr_tab_id:
          configData.SITE_LOGIN?.crunchyroll?.x_cr_tab_id ||
          defaultSettings.crunchyroll_x_cr_tab_id,
      };
      debugLog("Settings mapped from config", mappedSettings);
      const finalSettings = { ...defaultSettings, ...mappedSettings };
      debugLog("Final settings to apply", finalSettings);
      setSettings(finalSettings);
      debugLog("Settings loaded successfully from API");
      return;
    }
  } catch (error) {
    debugError(
      "Could not load from config.json, falling back to localStorage",
      error
    );
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
