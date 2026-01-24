import { useState, useEffect } from "react";
import { loadSettings } from "@/scripts/loadSettings";
import type { SettingType } from "@/types/SettingsType";
import { Film, Tv, Star, FileText } from "lucide-react";
import DownloadSearchbar from "@/components/searchbar-and-filters/downloadSearchbar";
import type { MediaItemType } from "@/types/MediaItemType";
import { mediaItems } from "@/MOCKUP/searchData";
import MediaItem from "@/components/mediaItem";
import NoResults from "@/components/noResults";

interface SettingsState {
  [key: string]: SettingType;
}

const Download = () => {
  const [settings, setSettings] = useState<SettingsState>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    loadSettings(setSettings);
  }, []);

  // Filter and sort logic
  const filteredItems = mediaItems
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesQuality =
        selectedQuality === "all" || item.quality === selectedQuality;
      return matchesSearch && matchesType && matchesQuality;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return b.year - a.year;
        case "oldest":
          return a.year - b.year;
        case "rating":
          return b.rating - a.rating;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getTypeIcon = (type: MediaItemType["type"]) => {
    switch (type) {
      case "movie":
        return <Film className="h-4 w-4" />;
      case "series":
        return <Tv className="h-4 w-4" />;
      case "anime":
        return <Star className="h-4 w-4" />;
      case "documentary":
        return <FileText className="h-4 w-4" />;
      default:
        return <Film className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: MediaItemType["type"]) => {
    switch (type) {
      case "movie":
        return "bg-blue-500";
      case "series":
        return "bg-green-500";
      case "anime":
        return "bg-purple-500";
      case "documentary":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex max-w-[80vw] flex-col gap-6 items-center">
        <div className="w-full space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Download Center
            </h1>
            <p className="text-muted-foreground">
              Browse and download your favorite movies, series, anime, and
              documentaries
            </p>
          </div>

          {/* Search and Filters */}
          <DownloadSearchbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedQuality={selectedQuality}
            setSelectedQuality={setSelectedQuality}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found {filteredItems.length} items
            </p>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MediaItem
                key={item.id}
                item={item}
                getTypeColor={getTypeColor}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredItems.length === 0 && <NoResults />}
        </div>
      </div>
    </div>
  );
};

export { Download };
