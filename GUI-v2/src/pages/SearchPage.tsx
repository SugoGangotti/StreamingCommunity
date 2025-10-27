import WIP from "../components/temp/wip";
import { useState } from "react";
import { MediaItem } from "../types/MediaItem";
import { searchMedia, startDownload, SearchRequest } from "../api/mediaApi";
import EpisodeSelector from "../components/EpisodeSelector";

type SearchResult = MediaItem & {
  type: "movie" | "series";
  payload_json: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchSite, setSearchSite] = useState("animeunity");
  const [server, setServer] = useState("Server 1");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      showMessage("error", "Inserisci un termine di ricerca");
      return;
    }

    setIsLoading(true);
    try {
      const searchRequest: SearchRequest = {
        site: searchSite,
        query: query.trim(),
      };

      const results = await searchMedia(searchRequest);
      setSearchResults(
        results.map((item, index) => ({
          ...item,
          id: item.id || `result-${index}`,
          type: item.display_type === "Film" ? "movie" : "series",
          payload_json: JSON.stringify(item),
        }))
      );
      setHasSearched(true);
      showMessage("success", `Trovati ${results.length} risultati`);
    } catch (error) {
      console.error("Search error:", error);
      showMessage("error", "Errore durante la ricerca");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = (item: SearchResult) => {
    if (item.display_type === "Serie TV") {
      setSelectedItem(item);
      setShowEpisodeSelector(true);
    } else {
      handleDownload(item);
    }
  };

  const handleDownload = async (
    item: SearchResult,
    season?: string,
    episode?: string
  ) => {
    try {
      const downloadRequest = {
        source_alias: item.source_alias,
        item_payload: item.payload_json,
        season: season || (item.display_type === "Serie TV" ? "1" : undefined),
        episode:
          episode || (item.display_type === "Serie TV" ? "1" : undefined),
      };

      const result = await startDownload(downloadRequest);

      if (result.success) {
        showMessage(
          "success",
          result.message || "Download avviato con successo!"
        );
        // Add to watchlist
        if (!watchlist.some((w) => w.id === item.id)) {
          setWatchlist((prev) => [...prev, item]);
        }
      } else {
        showMessage("error", result.message || "Errore durante il download");
      }
    } catch (error) {
      console.error("Download error:", error);
      showMessage("error", "Errore durante il download");
    }
  };

  const handleEpisodeDownload = async (season: string, episode: string) => {
    if (selectedItem) {
      await handleDownload(selectedItem, season, episode);
      setShowEpisodeSelector(false);
      setSelectedItem(null);
    }
  };

  const handleRemoveFromList = async (item: MediaItem) => {
    try {
      const result = await import("../api/mediaApi").then((api) =>
        api.removeFromList({
          source_alias: item.source_alias,
          item_payload: JSON.stringify(item),
        })
      );

      if (result.success) {
        setWatchlist((prev) => prev.filter((w) => w.id !== item.id));
        showMessage("success", "Rimosso dalla lista");
      } else {
        showMessage("error", result.message || "Errore durante la rimozione");
      }
    } catch (error) {
      console.error("Remove from list error:", error);
      showMessage("error", "Errore durante la rimozione");
    }
  };

  return (
    <div>
      <WIP />

      {/* Episode Selector Modal */}
      {showEpisodeSelector && selectedItem && (
        <EpisodeSelector
          item={selectedItem}
          onDownload={handleEpisodeDownload}
          onClose={() => {
            setShowEpisodeSelector(false);
            setSelectedItem(null);
          }}
        />
      )}

      <main className="flex-1 px-4 py-10 lg:px-40">
        <div className="mx-auto max-w-[960px]">
          {/* Title */}
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Ricerca Avanzata
              </p>
              <p className="text-gray-400 text-base font-normal leading-normal">
                Trova il tuo film o la tua serie TV.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="px-4 py-3">
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-gray-400 flex border-none bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-gray-800 focus:border-none h-full placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  placeholder="Cerca un film o una serie TV..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-r-lg transition-colors"
                >
                  {isLoading ? (
                    <svg
                      className="w-5 h-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </label>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 p-4">
            {/* Search Site Selection */}
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <label className="text-white text-base font-medium leading-normal">
                  Sito di ricerca
                </label>
                <div className="relative">
                  <select
                    value={searchSite}
                    onChange={(e) => setSearchSite(e.target.value)}
                    className="appearance-none h-10 w-48 cursor-pointer rounded-lg bg-gray-800 pl-4 pr-10 text-white text-sm font-medium leading-normal focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="animeunity">AnimeUnity</option>
                    <option value="streamingcommunity">
                      StreamingCommunity
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {hasSearched ? (
            <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="group relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  {result.bg_image_url && (
                    <img
                      className="w-full h-auto object-cover"
                      src={result.bg_image_url}
                      alt={result.display_title}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-0 left-0 w-full p-3">
                    <h3 className="text-white font-bold">
                      {result.display_title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400">
                        {result.display_release}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
                        {result.display_type}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                        {result.source}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <button
                        onClick={() => handleDownloadClick(result)}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        <span className="truncate">Scarica</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center p-8 text-center text-gray-400">
              <div>
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                  />
                </svg>
                <p className="text-lg">Nessun risultato trovato.</p>
                <p className="text-sm">
                  Prova a modificare i filtri o a cercare qualcos'altro.
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {hasSearched && searchResults.length > 0 && (
            <div className="flex items-center justify-center space-x-2 p-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              {Array.from(
                { length: Math.min(10, Math.ceil(searchResults.length / 12)) },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-white hover:bg-blue-600"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
                disabled={currentPage >= Math.ceil(searchResults.length / 12)}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Watchlist Section */}
          {watchlist.length > 0 && (
            <div className="mt-12">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">
                La mia lista
              </h2>
              <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {watchlist.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-lg bg-gray-800 shadow-lg"
                  >
                    {item.bg_image_url && (
                      <img
                        className="w-full h-auto object-cover"
                        src={item.bg_image_url}
                        alt={item.display_title}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-0 w-full p-3">
                      <h3 className="text-white font-bold">
                        {item.display_title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-400">
                          {item.display_release}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
                          {item.display_type}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                          {item.source}
                        </span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleDownloadClick(item as SearchResult)
                            }
                            className="flex items-center justify-center rounded-lg h-10 px-4 bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            Scarica
                          </button>
                          <button
                            onClick={() => handleRemoveFromList(item)}
                            className="flex items-center justify-center rounded-lg h-10 px-4 bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
