import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface TMDBApiResponse {
  title?: string;
  name?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  poster_path?: string;
  backdrop_path?: string;
}

interface TMDBDetails {
  title: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  poster_path?: string;
  backdrop_path?: string;
}

interface CustomDescriptionProps {
  tmdbUrl?: string;
  tmdbId?: string | number;
  mediaType?: "movie" | "tv" | "anime" | "series";
  maxChars?: number;
  className?: string;
}

const CustomDescription: React.FC<CustomDescriptionProps> = ({
  tmdbUrl,
  tmdbId,
  mediaType = "movie",
  maxChars = 300,
  className = "",
}) => {
  const [details, setDetails] = useState<TMDBDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchTMDBDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        let finalMediaType: string;
        let finalMediaId: string;

        // Handle tmdbUrl (existing logic)
        if (tmdbUrl && tmdbUrl.trim() !== "") {
          const tmdbMatch = tmdbUrl.match(/tmdb\.org\/(movie|tv)\/(\d+)/);
          if (!tmdbMatch) {
            throw new Error("URL TMDB non valido");
          }
          [, finalMediaType, finalMediaId] = tmdbMatch;
        }
        // Handle tmdbId (new logic)
        else if (tmdbId) {
          // Determine media type
          if (mediaType === "anime") {
            // For anime, we'll try movie first, then tv
            finalMediaType = "movie"; // Start with movie
          } else if (mediaType === "series") {
            finalMediaType = "tv";
          } else {
            finalMediaType = mediaType;
          }
          finalMediaId = tmdbId.toString();
        } else {
          throw new Error("Nessun tmdbUrl o tmdbId fornito");
        }

        // Use hardcoded API key for now (same as ImageCustom)
        const apiKey = "d8be8e961b3c541d094b5d233eb776b6";

        if (!apiKey) {
          throw new Error("API Key TMDB non configurata");
        }

        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Timeout")), 8000);
        });

        let data: TMDBApiResponse | null = null;
        let mediaTypesToTry: string[] = [];

        if (mediaType === "anime" && !tmdbUrl) {
          // For anime with tmdbId, try both movie and tv
          mediaTypesToTry = ["movie", "tv"];
        } else {
          mediaTypesToTry = [finalMediaType];
        }

        // Try each media type until we find a result
        for (const type of mediaTypesToTry) {
          try {
            const response = (await Promise.race([
              fetch(
                `https://api.themoviedb.org/3/${type}/${finalMediaId}?api_key=${apiKey}&language=it-IT`,
              ),
              timeoutPromise,
            ])) as Response;

            if (response.ok) {
              const responseData = await response.json();
              data = responseData;
              if (responseData.overview) {
                break; // Found valid data
              }
            }
          } catch {
            continue; // Try next media type
          }
        }

        if (!data) {
          throw new Error("Errore nel recupero dei dati da TMDB");
        }

        setDetails({
          title: data.title || data.name || "Titolo sconosciuto",
          overview:
            data.overview || "Non è stato possibile recuperare la descrizione",
          release_date: data.release_date || data.first_air_date,
          vote_average: data.vote_average,
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
        });
      } catch (err) {
        if (err instanceof Error && err.message === "Timeout") {
          setDetails({
            title: "Contenuto TMDB",
            overview: "Non è stato possibile recuperare la descrizione",
            release_date: "",
            vote_average: undefined,
            poster_path: undefined,
            backdrop_path: undefined,
          });
        } else {
          setError(err instanceof Error ? err.message : "Errore sconosciuto");
        }
      } finally {
        setLoading(false);
      }
    };

    if ((tmdbUrl && tmdbUrl.trim() !== "") || tmdbId) {
      fetchTMDBDetails();
    } else {
      setLoading(false);
    }
  }, [tmdbUrl, tmdbId, mediaType]);

  // Check if we have valid input
  if ((!tmdbUrl || tmdbUrl.trim() === "") && !tmdbId) {
    return (
      <div className={`p-4 text-gray-500 ${className}`}>
        <p>Nessun link TMDB o ID disponibile</p>
      </div>
    );
  }

  const shouldTruncate = details && details.overview.length > maxChars;
  const displayText =
    details && !isExpanded && shouldTruncate
      ? details.overview.substring(0, maxChars) + "..."
      : details?.overview;

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Loader2 className="animate-spin mr-2" size={20} />
        <span>Caricamento descrizione...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-red-500 text-sm mb-2">Errore: {error}</p>
        <p className="text-gray-600 text-xs">
          Configura la TMDB API Key nelle impostazioni per visualizzare la
          descrizione.
        </p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className={`p-4 text-gray-500 ${className}`}>
        <p>Nessuna descrizione disponibile</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header with title and rating */}
      <div className="flex items-start justify-between">
        <div>
          {details.release_date && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(details.release_date).getFullYear()}
            </p>
          )}
        </div>
        {details.vote_average && (
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {details.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>{displayText}</p>

        {shouldTruncate && (
          <div className="mt-2">
            {!isExpanded ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
              >
                Leggi di più
              </button>
            ) : (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
              >
                Leggi meno
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDescription;
