import TrendingBanner from "@/components/trending-banner";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { loadSettings } from "@/scripts/loadSettings";

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
      <div className="flex flex-row gap-4 items-center justify-center">
        questa è la homepage
        <Button>Click me</Button>
      </div>

      {settings.show_trending && <TrendingBanner />}
    </div>
  );
};

export { Homepage };
