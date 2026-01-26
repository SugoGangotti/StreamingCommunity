// Esempio di pagina Download integrata con il Frontend Manager

import { useState, useEffect } from "react";
import DownloadSearchbar from "@/components/searchbar-and-filters/filteringSearchbar";
import MediaItem from "@/components/mediaItem";
import NoResults from "@/components/noResults";
import { useSearch, useBackend } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, WifiOff } from "lucide-react";
import type { MediaItemType } from "@/types/MediaItemType";

const DownloadIntegrated = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Hook per il backend
  const {
    isAvailable,
    isLoading: backendLoading,
    error: backendError,
    retryConnection,
  } = useBackend();

  // Hook per la ricerca
  const {
    results: searchResults,
    isLoading: searchLoading,
    error: searchError,
    search,
    hasSearched,
  } = useSearch();

  // Esegui la ricerca quando il search term cambia
  useEffect(() => {
    if (searchTerm && isAvailable) {
      const timeoutId = setTimeout(() => {
        search(searchTerm);
      }, 500); // Debounce di 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, search, isAvailable]);

  // Filter and sort logic sui risultati reali
  const filteredItems = searchResults
    .filter((item: MediaItemType) => {
      const matchesSearch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesQuality =
        selectedQuality === "all" || item.quality === selectedQuality;
      return matchesSearch && matchesType && matchesQuality;
    })
    .sort((a: MediaItemType, b: MediaItemType) => {
      switch (sortBy) {
        case "latest":
          return (b.year || 0) - (a.year || 0);
        case "oldest":
          return (a.year || 0) - (b.year || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Mostra errore di backend
  if (!isAvailable && backendError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <WifiOff className="h-12 w-12 mx-auto text-muted-foreground" />
          <Alert variant="destructive">
            <AlertDescription>{backendError}</AlertDescription>
          </Alert>
          <Button onClick={retryConnection} disabled={backendLoading}>
            {backendLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Riprova la connessione
          </Button>
        </div>
      </div>
    );
  }

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
            {!isAvailable && (
              <p className="text-sm text-orange-600">
                Connessione al backend in corso...
              </p>
            )}
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

          {/* Loading State */}
          {(searchLoading || backendLoading) && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Caricamento...</span>
            </div>
          )}

          {/* Error State */}
          {searchError && (
            <Alert variant="destructive">
              <AlertDescription>{searchError}</AlertDescription>
            </Alert>
          )}

          {/* Results Count */}
          {!searchLoading && !backendLoading && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {hasSearched
                  ? `Trovati ${filteredItems.length} elementi`
                  : "Inizia una ricerca"}
              </p>
              {hasSearched && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => search(searchTerm)}
                  disabled={searchLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Aggiorna
                </Button>
              )}
            </div>
          )}

          {/* Media Grid */}
          {!searchLoading && !backendLoading && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MediaItem key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!searchLoading &&
            !backendLoading &&
            hasSearched &&
            filteredItems.length === 0 && <NoResults />}
        </div>
      </div>
    </div>
  );
};

export { DownloadIntegrated };
