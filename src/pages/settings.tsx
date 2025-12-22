import { useState, useEffect } from "react";
import optionsSchema from "@/lib/options_schema.json";
import { updateConfigFile } from "@/lib/config-manager";

interface SettingsState {
  [key: string]: any;
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsState>({});
  const [activeTab, setActiveTab] = useState("general");

  // Initialize settings with default values from schema
  useEffect(() => {
    const defaultSettings: SettingsState = {};
    optionsSchema.sections.forEach((section) => {
      section.settings.forEach((setting) => {
        defaultSettings[setting.id] = setting.default;
      });
    });

    // Try to load settings from config.json first, then fallback to localStorage
    const loadSettings = async () => {
      try {
        // Try to get settings from config.json via API
        const response = await fetch("http://localhost:3001/api/config");
        if (response.ok) {
          const configData = await response.json();
          // Map config.json to UI settings format
          const mappedSettings = {
            debug: configData.DEFAULT?.debug || defaultSettings.debug,
            show_message:
              configData.DEFAULT?.show_message || defaultSettings.show_message,
            show_trending:
              configData.DEFAULT?.show_trending ||
              defaultSettings.show_trending,
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
              configData.OUT_FOLDER?.add_siteName ||
              defaultSettings.add_siteName,
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
            use_gpu:
              configData.M3U8_CONVERSION?.use_gpu || defaultSettings.use_gpu,
            force_resolution:
              configData.M3U8_CONVERSION?.force_resolution ||
              defaultSettings.force_resolution,
            extension:
              configData.M3U8_CONVERSION?.extension ||
              defaultSettings.extension,
            default_preset:
              configData.M3U8_CONVERSION?.default_preset ||
              defaultSettings.default_preset,
            use_codec:
              configData.M3U8_CONVERSION?.use_codec ||
              defaultSettings.use_codec,
            qbit_host:
              configData.QBIT_CONFIG?.host || defaultSettings.qbit_host,
            qbit_port:
              configData.QBIT_CONFIG?.port || defaultSettings.qbit_port,
            qbit_user:
              configData.QBIT_CONFIG?.user || defaultSettings.qbit_user,
            qbit_pass:
              configData.QBIT_CONFIG?.pass || defaultSettings.qbit_pass,
            verify: configData.REQUESTS?.verify || defaultSettings.verify,
            timeout: configData.REQUESTS?.timeout || defaultSettings.timeout,
            max_retry:
              configData.REQUESTS?.max_retry || defaultSettings.max_retry,
          };
          setSettings({ ...defaultSettings, ...mappedSettings });
          return;
        }
      } catch (error) {
        console.log(
          "Could not load from config.json, falling back to localStorage"
        );
      }

      // Fallback to localStorage
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
        } catch (error) {
          console.error("Failed to parse saved settings:", error);
          setSettings(defaultSettings);
        }
      } else {
        setSettings(defaultSettings);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    console.log("Saving settings:", settings);

    // Save to localStorage as before
    localStorage.setItem("appSettings", JSON.stringify(settings));

    // Also update the config.json structure
    const success = await updateConfigFile(settings);

    if (success) {
      console.log("Settings saved successfully");
    }
  };

  const handleReset = () => {
    const defaultSettings: SettingsState = {};
    optionsSchema.sections.forEach((section) => {
      section.settings.forEach((setting) => {
        defaultSettings[setting.id] = setting.default;
      });
    });
    setSettings(defaultSettings);
  };

  const updateSetting = (settingId: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [settingId]: value,
    }));
  };

  const renderSettingField = (setting: any) => {
    const value = settings[setting.id] || setting.default;

    switch (setting.type) {
      case "boolean":
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateSetting(setting.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#292938] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        );

      case "text":
      case "password":
        return (
          <input
            type={setting.type}
            value={value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="bg-[#292938] border-none text-white rounded-lg px-3 py-2 focus:ring-primary focus:border-primary w-48"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              updateSetting(setting.id, parseInt(e.target.value))
            }
            min={setting.validation?.min || 0}
            max={setting.validation?.max || 999}
            className="bg-[#292938] border-none text-white rounded-lg px-3 py-2 focus:ring-primary focus:border-primary w-20"
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="form-select bg-[#292938] border-none text-white rounded-lg focus:ring-primary focus:border-primary w-48"
          >
            {setting.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "list":
        return (
          <select
            value={value[0] || ""}
            onChange={(e) => updateSetting(setting.id, [e.target.value])}
            className="form-select bg-[#292938] border-none text-white rounded-lg focus:ring-primary focus:border-primary w-48"
          >
            {setting.default?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return <span className="text-[#9d9db8]">Tipo non supportato</span>;
    }
  };

  return (
    <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-10">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Impostazioni Account
            </p>
            <p className="text-[#9d9db8] text-base font-normal leading-normal">
              Gestisci le tue preferenze di visualizzazione, le notifiche e le
              impostazioni di download.
            </p>
          </div>
        </div>

        <div className="pb-3 mt-6">
          <div className="flex border-b border-[#3c3c53] px-4 gap-8">
            {optionsSchema.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                  activeTab === section.id
                    ? "border-b-primary text-white"
                    : "border-b-transparent text-[#9d9db8] hover:text-white"
                }`}
              >
                <p className="text-inherit text-sm font-bold leading-normal tracking-[0.015em]">
                  {section.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 p-4">
          {optionsSchema.sections.map(
            (section) =>
              activeTab === section.id && (
                <section key={section.id}>
                  <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                    {section.label}
                  </h2>
                  {section.description && (
                    <p className="text-[#9d9db8] text-sm font-normal leading-normal mb-4">
                      {section.description}
                    </p>
                  )}
                  <div className="flex flex-col divide-y divide-[#292938]">
                    {section.settings.map((setting) => (
                      <div
                        key={setting.id}
                        className="flex items-center gap-4 bg-background-dark px-4 min-h-[72px] py-3 justify-between"
                      >
                        <div className="flex flex-col justify-center">
                          <p className="text-white text-base font-medium leading-normal line-clamp-1">
                            {setting.label}
                          </p>
                          {setting.type === "boolean" && (
                            <p className="text-[#9d9db8] text-sm font-normal leading-normal line-clamp-2">
                              {"description" in setting &&
                              typeof setting.description === "string"
                                ? setting.description
                                : `Abilita/disabilita ${setting.label.toLowerCase()}`}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0">
                          {renderSettingField(setting)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
          )}
        </div>

        <div className="flex justify-end gap-4 p-4 mt-8 border-t border-[#292938]">
          <button
            onClick={handleReset}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-[#292938] text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Ripristina</span>
          </button>

          <button
            onClick={handleSave}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Salva Modifiche</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { Settings };
