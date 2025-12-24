import TrendingBanner from "@/components/trending-banner";
import { useState, useEffect } from "react";
import { loadSettings } from "@/scripts/loadSettings";
import UpdateVersion from "@/components/update-version";

interface SettingsState {
  [key: string]: any;
}

const Homepage = () => {
  const [settings, setSettings] = useState<SettingsState>({});

  useEffect(() => {
    loadSettings(setSettings);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex max-w-[80vw] flex-col gap-4 items-center">
        {settings.show_message && <UpdateVersion />}

        {settings.show_trending && <TrendingBanner />}
      </div>
    </div>
  );
};

export { Homepage };
