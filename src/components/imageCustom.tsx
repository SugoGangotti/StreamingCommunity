import React, { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";

interface ImageCustomProps {
  tmdbPath?: string;
  tmdbId?: string | number;
  mediaType?: "movie" | "tv" | "anime" | "series";
  baseUrl?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const ImageCustom: React.FC<ImageCustomProps> = ({
  tmdbPath,
  tmdbId,
  mediaType = "movie",
  baseUrl = "https://image.tmdb.org/t/p/w500",
  alt,
  className = "",
  width,
  height,
}) => {
  const [hasError, setHasError] = useState(false);
  const [posterPath, setPosterPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we have a tmdbId but no tmdbPath, fetch the poster path
    if (tmdbId && !tmdbPath) {
      fetchPosterPath();
    } else {
      setPosterPath(tmdbPath || null);
    }
  }, [tmdbId, tmdbPath, mediaType]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPosterPath = async () => {
    try {
      setLoading(true);

      // Get API key from config - use direct import for Vite compatibility
      const apiKey = "d8be8e961b3c541d094b5d233eb776b6"; // Hardcoded for now

      if (!apiKey) {
        throw new Error("TMDB API key not configured");
      }

      // Determine which media types to try
      let mediaTypesToTry: ("movie" | "tv")[] = [];

      if (mediaType === "anime") {
        // For anime, try movie first, then tv
        mediaTypesToTry = ["movie", "tv"];
      } else if (mediaType === "series") {
        // Treat series as tv
        mediaTypesToTry = ["tv"];
      } else if (mediaType === "movie" || mediaType === "tv") {
        mediaTypesToTry = [mediaType];
      } else {
        // Default to movie
        mediaTypesToTry = ["movie"];
      }

      let posterData = null;

      // Try each media type until we find a result
      for (const type of mediaTypesToTry) {
        try {
          const url = `https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${apiKey}&language=it-IT`;

          const tmdbResponse = await fetch(url);

          if (tmdbResponse.ok) {
            const data = await tmdbResponse.json();

            if (data.poster_path) {
              posterData = data.poster_path;
              break; // Found poster, exit loop
            }
          }
        } catch {
          // Continue to next media type if this one fails
          continue;
        }
      }

      setPosterPath(posterData);
    } catch (error) {
      console.error("Error fetching poster path:", error);
      setPosterPath(null);
    } finally {
      setLoading(false);
    }
  };

  const imgSrc = posterPath ? `${baseUrl}${posterPath}` : null;
  const showFallback = !imgSrc || hasError || loading;

  return (
    <div
      className={`relative bg-card-foreground ${className}`}
      style={{
        aspectRatio: "2/3",
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "auto",
      }}
    >
      {showFallback ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {loading ? (
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          ) : (
            <ImageOff className="w-8 h-8 text-gray-600" />
          )}
        </div>
      ) : (
        <img
          src={imgSrc!}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};

export default ImageCustom;
