import { useState } from "react";
import DownloadSearchbar from "@/components/searchbar-and-filters/downloadSearchbar";
import { mediaItems } from "@/MOCKUP/searchData";
import MediaItem from "@/components/mediaItem";
import NoResults from "@/components/noResults";

const Download = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Filter and sort logic
  const filteredItems = mediaItems
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesQuality =
        selectedQuality === "all" || item.quality === selectedQuality;
      return matchesSearch && matchesType && matchesQuality;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return b.year! - a.year!;
        case "oldest":
          return a.year! - b.year!;
        case "rating":
          return b.rating! - a.rating!;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

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
              <MediaItem key={item.id} item={item} />
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
