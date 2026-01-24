import { useState, useEffect } from "react";
import { loadSettings } from "@/scripts/loadSettings";
import type { Setting } from "@/types/Setting";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download as DownloadIcon,
  Search,
  Film,
  Tv,
  Clock,
  Star,
  Calendar,
  FileText,
} from "lucide-react";
import DownloadSearchbar from "@/components/searchbar-and-filters/downloadSearchbar";
import type { MediaItem } from "@/types/MediaItem";
import { mediaItems } from "@/MOCKUP/searchData";

interface SettingsState {
  [key: string]: Setting;
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

  const getTypeIcon = (type: MediaItem["type"]) => {
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

  const getTypeColor = (type: MediaItem["type"]) => {
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
              <Card
                key={item.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative aspect-2/3 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`${getTypeColor(item.type)} text-white text-xs`}
                    >
                      {getTypeIcon(item.type)}
                      <span className="ml-1">{item.type}</span>
                    </Badge>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-black/70 text-white"
                    >
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {item.rating}
                    </Badge>
                  </div>

                  {/* Download Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="transform scale-90 group-hover:scale-100 transition-transform"
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{item.year}</span>
                    {item.duration && (
                      <>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>{item.duration}</span>
                      </>
                    )}
                    {item.seasons && (
                      <>
                        <Tv className="h-3 w-3 ml-2" />
                        <span>{item.seasons} seasons</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.quality}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.size}
                      </span>
                    </div>
                    <DownloadIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredItems.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export { Download };
