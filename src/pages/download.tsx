import { useState } from "react";
import { mediaItems } from "@/MOCKUP/searchData";
import MediaItem from "@/components/mediaItem";
import NoResults from "@/components/noResults";
import DownloadFilters from "@/components/searchbar-and-filters/downloadFilters";

const Download = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [hasSearched, setHasSearched] = useState(false);
  const [tempSearchTerm, setTempSearchTerm] = useState("");

  const handleSearchSubmit = () => {
    if (tempSearchTerm.trim()) {
      setSearchTerm(tempSearchTerm);
      setHasSearched(true);
    }
  };

  const handleNewSearch = () => {
    setHasSearched(false);
    setTempSearchTerm("");
    setSearchTerm("");
  };

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
              {!hasSearched
                ? "Search for your favorite movies, series, anime, and documentaries"
                : "Browse and download your favorite movies, series, anime, and documentaries"}
            </p>
          </div>

          {!hasSearched ? (
            /* Initial Search State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-full max-w-2xl">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search movies, series, anime..."
                    value={tempSearchTerm}
                    onChange={(e) => setTempSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                    className="w-full pl-10 pr-4 py-3 text-lg border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearchSubmit}
                  disabled={!tempSearchTerm.trim()}
                  className="mt-4 w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Filters */}
              <DownloadFilters
                searchTerm={searchTerm}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedQuality={selectedQuality}
                setSelectedQuality={setSelectedQuality}
                sortBy={sortBy}
                setSortBy={setSortBy}
                handleNewSearch={handleNewSearch}
              />

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Found {filteredItems.length} items for "{searchTerm}"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export { Download };
