import { toast } from "sonner";

interface SettingsState {
  [key: string]: any;
}

interface ConfigStructure {
  DEFAULT: {
    debug: boolean;
    show_message: boolean;
    show_trending: boolean;
    fetch_domain_online: boolean;
    telegram_bot: boolean;
    bypass_dns: boolean;
  };
  OUT_FOLDER: {
    root_path: string;
    movie_folder_name: string;
    serie_folder_name: string;
    anime_folder_name: string;
    map_episode_name: string;
    add_siteName: boolean;
    cleanup_tmp_folder: boolean;
  };
  QBIT_CONFIG: {
    host: string;
    port: string;
    user: string;
    pass: string;
  };
  M3U8_DOWNLOAD: {
    default_video_workers: number;
    default_audio_workers: number;
    segment_timeout: number;
    enable_retry: boolean;
    specific_list_audio: string[];
    download_subtitle: boolean;
    merge_subs: boolean;
    specific_list_subtitles: string[];
    limit_segment: number;
    cleanup_tmp_folder: boolean;
    get_only_link: boolean;
  };
  M3U8_CONVERSION: {
    use_codec: boolean;
    use_vcodec: boolean;
    use_acodec: boolean;
    use_bitrate: boolean;
    use_gpu: boolean;
    default_preset: string;
    param_video: string[];
    param_audio: string[];
    param_subtitles: string[];
    param_final: string[];
    force_resolution: string;
    extension: string;
  };
  REQUESTS: {
    verify: boolean;
    timeout: number;
    max_retry: number;
  };
  HOOKS: {
    pre_run: string[];
    post_run: string[];
  };
  SITE_LOGIN: {
    crunchyroll: {
      etp_rt: string;
      x_cr_tab_id: string;
    };
  };
}

/**
 * Maps UI settings to config.json structure
 */
export const mapSettingsToConfig = (
  settings: SettingsState
): Partial<ConfigStructure> => {
  return {
    DEFAULT: {
      debug: settings.debug || false,
      show_message: settings.show_message || false,
      show_trending: settings.show_trending || false,
      fetch_domain_online: settings.fetch_domain_online || true,
      telegram_bot: settings.telegram_bot || false,
      bypass_dns: settings.bypass_dns || false,
    },
    OUT_FOLDER: {
      root_path: settings.root_path || "/mnt/arrowarmedia/",
      movie_folder_name: settings.movie_folder_name || "Film",
      serie_folder_name: settings.serie_folder_name || "SerieTV",
      anime_folder_name: settings.anime_folder_name || "Anime",
      map_episode_name:
        settings.map_episode_name || "E%(episode)_%(episode_name)",
      add_siteName: settings.add_siteName || false,
      cleanup_tmp_folder: settings.cleanup_tmp_folder || false,
    },
    QBIT_CONFIG: {
      host: settings.qbit_host || "192.168.1.51",
      port: settings.qbit_port || "6666",
      user: settings.qbit_user || "admin",
      pass: settings.qbit_pass || "adminadmin",
    },
    M3U8_DOWNLOAD: {
      default_video_workers: settings.default_video_workers || 8,
      default_audio_workers: settings.default_audio_workers || 8,
      segment_timeout: settings.segment_timeout || 8,
      enable_retry:
        settings.enable_retry !== undefined ? settings.enable_retry : true,
      specific_list_audio: settings.specific_list_audio || ["ita", "eng"],
      download_subtitle: settings.download_subtitle || false,
      merge_subs: settings.merge_subs || false,
      specific_list_subtitles: settings.specific_list_subtitles || [],
      limit_segment: settings.limit_segment || 0,
      cleanup_tmp_folder: settings.cleanup_tmp_folder_download || false,
      get_only_link: settings.get_only_link || false,
    },
    M3U8_CONVERSION: {
      use_codec: settings.use_codec || false,
      use_vcodec: settings.use_vcodec || true,
      use_acodec: settings.use_acodec || true,
      use_bitrate: settings.use_bitrate || true,
      use_gpu: settings.use_gpu || false,
      default_preset: settings.default_preset || "ultrafast",
      param_video: settings.param_video
        ? settings.param_video.split(" ")
        : ["-c:v", "libx265", "-crf", "28", "-preset", "medium"],
      param_audio: settings.param_audio
        ? settings.param_audio.split(" ")
        : ["-c:a", "libopus", "-b:a", "128k"],
      param_subtitles: settings.param_subtitles
        ? settings.param_subtitles.split(" ")
        : ["-c:s", "webvtt"],
      param_final: settings.param_final
        ? settings.param_final.split(" ")
        : ["-c", "copy"],
      force_resolution: settings.force_resolution || "Best",
      extension: settings.extension || ".mp4",
    },
    REQUESTS: {
      verify: settings.verify !== undefined ? settings.verify : false,
      timeout: settings.timeout || 20,
      max_retry: settings.max_retry || 8,
    },
    HOOKS: {
      pre_run: settings.pre_run ? [settings.pre_run] : [],
      post_run: settings.post_run ? [settings.post_run] : [],
    },
    SITE_LOGIN: {
      crunchyroll: {
        etp_rt: settings.crunchyroll_etp_rt || "",
        x_cr_tab_id: settings.crunchyroll_x_cr_tab_id || "",
      },
    },
  };
};

/**
 * Updates the config.json file with new settings
 */
export const updateConfigFile = async (
  settings: SettingsState
): Promise<boolean> => {
  try {
    const configData = mapSettingsToConfig(settings);

    // Call the backend API to update config.json
    const response = await fetch("http://localhost:3001/api/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(configData),
    });

    if (!response.ok) {
      throw new Error("Failed to update config file");
    }

    toast.success("Configurazione salvata con successo!");
    return true;
  } catch (error) {
    console.error("Error updating config file:", error);
    toast.error(
      "Errore durante il salvataggio della configurazione. Assicurati che il server sia in esecuzione."
    );
    return false;
  }
};

/**
 * Alternative implementation for development without backend
 * This saves to localStorage and shows a message about backend integration
 */
export const updateConfigFileDev = async (
  settings: SettingsState
): Promise<boolean> => {
  try {
    const configData = mapSettingsToConfig(settings);

    // Save to localStorage as fallback
    localStorage.setItem("appConfig", JSON.stringify(configData));

    // Show info message about backend integration
    toast.info(
      "Configurazione salvata localmente. Per salvare nel file config.json è necessario un backend.",
      {
        duration: 5000,
      }
    );

    console.log("Config data that would be saved to config.json:", configData);
    return true;
  } catch (error) {
    console.error("Error saving config locally:", error);
    toast.error("Errore durante il salvataggio della configurazione");
    return false;
  }
};
