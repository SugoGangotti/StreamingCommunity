import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState, useEffect } from "react";
import optionsSchema from "@/lib/options_schema.json";
import { updateConfigFile } from "@/lib/config-manager";
import { Switch } from "@/components/ui/switch";
import { loadSettings } from "@/scripts/loadSettings";
import { debugLog, setDebugMode } from "@/scripts/debug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

interface SettingsState {
  [key: string]: any;
}

export const TestSettings = () => {
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
        return (
          <Input
            type="text"
            className="w-70"
            value={value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
          />
        );

      case "password":
        return (
          <Input
            type="password"
            className="w-70"
            value={value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            className="w-20"
            value={value}
            min={setting.validation?.min || 0}
            max={setting.validation?.max || 999}
            onChange={(e) =>
              updateSetting(setting.id, parseInt(e.target.value))
            }
          />
        );

      case "single-select":
        return (
          <Select
            value={value}
            onValueChange={(newValue) => updateSetting(setting.id, newValue)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiple-select":
        return (
          <MultiSelect
            values={value}
            onValuesChange={(newValues) => updateSetting(setting.id, newValues)}
          >
            <MultiSelectTrigger className="w-48">
              <MultiSelectValue placeholder="Seleziona opzioni..." />
            </MultiSelectTrigger>
            <MultiSelectContent>
              <MultiSelectGroup>
                {setting.extended_options
                  ? Object.keys(setting.extended_options).map(
                      (option: string) => (
                        <MultiSelectItem key={option} value={option}>
                          {setting.extended_options?.[option] || option}
                          <p className="uppercase">[{option}]</p>
                        </MultiSelectItem>
                      )
                    )
                  : setting.default?.map((option: string) => (
                      <MultiSelectItem key={option} value={option}>
                        {setting.extended_options?.[option] || option}
                        <p className="uppercase">[{option}]</p>
                      </MultiSelectItem>
                    ))}
              </MultiSelectGroup>
            </MultiSelectContent>
          </MultiSelect>
        );

      default:
        return <span className="text-[#9d9db8]">Tipo non supportato</span>;
    }
  };

  return (
    <div className="px-4 md:px-10 lg:px-20 xl:px-60 flex flex-col w-screen justify-center py-10">
      <Card className="p-6 mb-2 w-full gap-3 justify-between flex flex-col">
        <CardTitle className="text-4xl font-black">Impostazioni</CardTitle>

        <CardDescription className="text-[#9d9db8] text-base">
          Gestisci le tue preferenze di visualizzazione, le notifiche e le
          impostazioni di download.
        </CardDescription>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-blue-800 dark:bg-black w-full gap-1 p-1 flex-wrap h-full">
          {optionsSchema.sections.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="hover:bg-blue-300/80 dark:hover:bg-blue-900/80"
            >
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {optionsSchema.sections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <Card className="p-4 gap-3 w-full">
              <CardHeader className="mb-4">
                <CardTitle className="text-2xl font-bold leading-tight tracking-[-0.015em] pt-5">
                  {section.label}
                </CardTitle>

                {section.description && (
                  <CardDescription className="text-[#9d9db8] text-md font-normal leading-normal">
                    {section.description}
                  </CardDescription>
                )}
              </CardHeader>

              {section.settings.map((setting) => (
                <Card
                  key={setting.id}
                  className="p-0 bg-blue-800/10 dark:bg-black/10 shadow-none border-0"
                >
                  <CardContent className="w-full p-4 flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <CardTitle className="text-base">
                        {setting.label}
                      </CardTitle>

                      {"description" in setting ? (
                        <CardDescription>{setting.description}</CardDescription>
                      ) : setting.type === "boolean" ? (
                        <CardDescription>
                          {`Abilita/disabilita ${setting.label.toLowerCase()}`}
                        </CardDescription>
                      ) : null}
                    </div>

                    {renderSettingField(setting)}
                  </CardContent>
                </Card>
              ))}
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end gap-4 p-4">
        <Button
          variant="outline"
          onClick={handleReset}
          className="h-10 px-6 text-md"
        >
          Ripristina
        </Button>

        <Button
          variant="default"
          onClick={handleSave}
          className="h-10 px-6 font-bold text-md"
        >
          Salva Modifiche
        </Button>
      </div>
    </div>
  );
};
