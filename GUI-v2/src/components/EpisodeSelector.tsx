import { useState } from "react";
import { startDownload } from "../api/mediaApi";
import { MediaItem } from "../types/MediaItem";

interface EpisodeSelectorProps {
  item: MediaItem & { payload_json: string };
  onDownload: (season: string, episode: string) => Promise<void>;
  onClose: () => void;
}

export default function EpisodeSelector({
  item,
  onDownload,
  onClose,
}: EpisodeSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState("1");
  const [selectedEpisode, setSelectedEpisode] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  // Mock episode data - in a real app, this would come from the API
  const seasons = Array.from({ length: 5 }, (_, i) => ({
    number: (i + 1).toString(),
    episodes: Array.from(
      { length: Math.floor(Math.random() * 12) + 8 },
      (_, j) => (j + 1).toString()
    ),
  }));

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await onDownload(selectedSeason, selectedEpisode);
      onClose();
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-bold">
              {item.display_title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
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
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
              {item.display_type}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
              {item.source}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Season Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Seleziona Stagione
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {seasons.map((season) => (
                <option key={season.number} value={season.number}>
                  Stagione {season.number}
                </option>
              ))}
            </select>
          </div>

          {/* Episode Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Seleziona Episodio
            </label>
            <select
              value={selectedEpisode}
              onChange={(e) => setSelectedEpisode(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {seasons
                .find((s) => s.number === selectedSeason)
                ?.episodes.map((episode) => (
                  <option key={episode} value={episode}>
                    Episodio {episode}
                  </option>
                ))}
            </select>
          </div>

          {/* Preview Info */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Dettagli Download</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>
                <span className="text-gray-400">Titolo:</span>{" "}
                {item.display_title}
              </p>
              <p>
                <span className="text-gray-400">Stagione:</span>{" "}
                {selectedSeason}
              </p>
              <p>
                <span className="text-gray-400">Episodio:</span>{" "}
                {selectedEpisode}
              </p>
              <p>
                <span className="text-gray-400">Fonte:</span> {item.source}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
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
                Download...
              </>
            ) : (
              <>
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Scarica Episodio
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
