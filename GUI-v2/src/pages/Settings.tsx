import WIP from "../components/temp/wip";
import { useState } from "react";

type SettingsData = {
  videoQuality: string;
  audioLanguage: string;
  subtitleLanguage: string;
  autoplayNext: boolean;
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("visualizzazione");
  const [settings, setSettings] = useState<SettingsData>({
    videoQuality: "HD (1080p)",
    audioLanguage: "Italiano",
    subtitleLanguage: "Italiano",
    autoplayNext: true,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    console.log("Saving settings:", settings);
  };

  const handleReset = () => {
    setSettings({
      videoQuality: "Auto",
      audioLanguage: "Italiano",
      subtitleLanguage: "Nessuno",
      autoplayNext: false,
    });
  };

  const updateSetting = (key: keyof SettingsData, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <WIP />

      <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-10">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Impostazioni Account
              </p>
              <p className="text-gray-400 text-base font-normal leading-normal">
                Gestisci le tue preferenze di visualizzazione, le notifiche e le
                impostazioni di download.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="pb-3 mt-6">
            <div className="flex border-b border-gray-600 px-4 gap-8">
              <button
                onClick={() => setActiveTab("visualizzazione")}
                className={`flex flex-col items-center justify-center pb-[13px] pt-4 transition-colors ${
                  activeTab === "visualizzazione"
                    ? "border-b-[3px] border-b-blue-600 text-white"
                    : "border-b-[3px] border-b-transparent text-gray-400 hover:text-white"
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                  Visualizzazione
                </p>
              </button>
              <button
                onClick={() => setActiveTab("notifiche")}
                className={`flex flex-col items-center justify-center pb-[13px] pt-4 transition-colors ${
                  activeTab === "notifiche"
                    ? "border-b-[3px] border-b-blue-600 text-white"
                    : "border-b-[3px] border-b-transparent text-gray-400 hover:text-white"
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                  Notifiche
                </p>
              </button>
              <button
                onClick={() => setActiveTab("download")}
                className={`flex flex-col items-center justify-center pb-[13px] pt-4 transition-colors ${
                  activeTab === "download"
                    ? "border-b-[3px] border-b-blue-600 text-white"
                    : "border-b-[3px] border-b-transparent text-gray-400 hover:text-white"
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                  Download
                </p>
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex flex-col gap-8 p-4">
            {activeTab === "visualizzazione" && (
              <section>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                  Preferenze di Visualizzazione
                </h2>
                <div className="flex flex-col divide-y divide-gray-700">
                  {/* Video Quality */}
                  <div className="flex items-center gap-4 bg-gray-900 px-4 min-h-[72px] py-3 justify-between">
                    <div className="flex flex-col justify-center">
                      <p className="text-white text-base font-medium leading-normal">
                        Qualità video predefinita
                      </p>
                      <p className="text-gray-400 text-sm font-normal leading-normal">
                        Imposta la qualità video predefinita per lo streaming.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <select
                        value={settings.videoQuality}
                        onChange={(e) =>
                          updateSetting("videoQuality", e.target.value)
                        }
                        className="form-select bg-gray-800 border-none text-white rounded-lg focus:ring-blue-600 focus:border-blue-600"
                      >
                        <option>Auto</option>
                        <option>HD (1080p)</option>
                        <option>SD (480p)</option>
                        <option>4K</option>
                      </select>
                    </div>
                  </div>

                  {/* Audio Language */}
                  <div className="flex items-center gap-4 bg-gray-900 px-4 min-h-[72px] py-3 justify-between">
                    <div className="flex flex-col justify-center">
                      <p className="text-white text-base font-medium leading-normal">
                        Lingua audio predefinita
                      </p>
                      <p className="text-gray-400 text-sm font-normal leading-normal">
                        Scegli la lingua audio di default.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <select
                        value={settings.audioLanguage}
                        onChange={(e) =>
                          updateSetting("audioLanguage", e.target.value)
                        }
                        className="form-select bg-gray-800 border-none text-white rounded-lg focus:ring-blue-600 focus:border-blue-600"
                      >
                        <option>Italiano</option>
                        <option>Inglese</option>
                        <option>Spagnolo</option>
                      </select>
                    </div>
                  </div>

                  {/* Subtitle Language */}
                  <div className="flex items-center gap-4 bg-gray-900 px-4 min-h-[72px] py-3 justify-between">
                    <div className="flex flex-col justify-center">
                      <p className="text-white text-base font-medium leading-normal">
                        Lingua sottotitoli predefinita
                      </p>
                      <p className="text-gray-400 text-sm font-normal leading-normal">
                        Scegli la lingua dei sottotitoli di default.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <select
                        value={settings.subtitleLanguage}
                        onChange={(e) =>
                          updateSetting("subtitleLanguage", e.target.value)
                        }
                        className="form-select bg-gray-800 border-none text-white rounded-lg focus:ring-blue-600 focus:border-blue-600"
                      >
                        <option>Nessuno</option>
                        <option>Italiano</option>
                        <option>Inglese</option>
                      </select>
                    </div>
                  </div>

                  {/* Autoplay */}
                  <div className="flex items-center gap-4 bg-gray-900 px-4 min-h-[72px] py-3 justify-between">
                    <div className="flex flex-col justify-center">
                      <p className="text-white text-base font-medium leading-normal">
                        Autoplay prossimo episodio
                      </p>
                      <p className="text-gray-400 text-sm font-normal leading-normal">
                        Riproduci automaticamente l'episodio successivo.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoplayNext}
                          onChange={(e) =>
                            updateSetting("autoplayNext", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            settings.autoplayNext
                              ? "bg-blue-600 after:border-white"
                              : "bg-gray-800 after:border-gray-300"
                          }`}
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "notifiche" && (
              <section>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                  Impostazioni Notifiche
                </h2>
                <p className="text-gray-400">
                  Le impostazioni delle notifiche saranno implementate qui.
                </p>
              </section>
            )}

            {activeTab === "download" && (
              <section>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                  Impostazioni Download
                </h2>
                <p className="text-gray-400">
                  Le impostazioni di download saranno implementate qui.
                </p>
              </section>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 p-4 mt-8 border-t border-gray-700">
            <button
              onClick={handleReset}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-gray-800 text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Ripristina</span>
            </button>
            <button
              onClick={handleSave}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Salva Modifiche</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
