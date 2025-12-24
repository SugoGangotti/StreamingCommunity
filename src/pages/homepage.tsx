import TrendingBanner from "@/components/trending-banner";
import { Button } from "@/components/ui/button";
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
    <div className="flex h-full w-full flex-col gap-4 items-center justify-center">
      <UpdateVersion />

      {settings.show_trending && <TrendingBanner />}
    </div>
  );
};

export { Homepage };
