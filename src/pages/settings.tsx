import { useState, useEffect } from "react";
import optionsSchema from "@/lib/options_schema.json";
import { updateConfigFile } from "@/lib/config-manager";
import { Switch } from "@/components/ui/switch";
import { loadSettings } from "@/scripts/loadSettings";
import { debugLog, setDebugMode } from "@/scripts/debug";

interface SettingsState {
  [key: string]: any;
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsState>({});
  const [activeTab, setActiveTab] = useState("general");

  // Initialize settings with default values from schema
  useEffect(() => {
    loadSettings(setSettings);
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
    debugLog(`Updating ${settingId} to:`, value);
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        [settingId]: value,
      };
      debugLog("New settings state:", newSettings);

      // Update debug mode if debug setting is changed
      if (settingId === "debug") {
        setDebugMode(value);
        debugLog(`Debug mode ${value ? "enabled" : "disabled"}`);
      }

      return newSettings;
    });
  };

  const renderSettingField = (setting: any) => {
    const value =
      settings[setting.id] !== undefined
        ? settings[setting.id]
        : setting.default;
    debugLog(
      `Rendering ${setting.id} with value: ${value}, type: ${setting.type}`
    );

    switch (setting.type) {
      case "boolean":
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => {
              debugLog(`Switch ${setting.id} changed to:`, checked);
              updateSetting(setting.id, checked);
            }}
          />
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
              Impostazioni
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
