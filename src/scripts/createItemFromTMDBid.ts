/* eslint-disable @typescript-eslint/no-explicit-any */
import { debugLog, debugError } from "./debug";
import { getTMDBDetails } from "./findTMDBid";
import type { MediaItemType } from "@/types/MediaItemType";

/**
 * Crea un elemento MediaItemType a partire da un ID TMDB
 * @param tmdbId - ID di TMDB del film o serie TV
 * @param mediaType - Tipo di media ('movie' o 'tv')
 * @param additionalData - Dati aggiuntivi opzionali (downloadUrl, size, quality)
 * @returns Promise che risolve con l'elemento MediaItemType completo
 */
export const createItemFromTMDBid = async (
  tmdbId: number,
  mediaType: "movie" | "tv",
  additionalData?: {
    downloadUrl?: string;
    size?: string;
    quality?: string;
  },
): Promise<MediaItemType> => {
  debugLog(
    `Creating MediaItemType from TMDB ID: ${tmdbId}, type: ${mediaType}`,
  );

  try {
    // Ottieni i dettagli completi da TMDB
    const tmdbDetails = await getTMDBDetails(tmdbId, mediaType);

    if (!tmdbDetails) {
      throw new Error(`No details found for TMDB ID: ${tmdbId}`);
    }

    // Mappa il tipo di media da TMDB a MediaItemType
    const mappedType = mediaType === "movie" ? "movie" : "series";

    // Crea l'oggetto MediaItemType di base
    const mediaItem: MediaItemType = {
      id: `tmdb_${tmdbId}`,
      type: mappedType,
      size: additionalData?.size || "N/A",
      quality: additionalData?.quality || "N/A",
      downloadUrl: additionalData?.downloadUrl || "",

      tmdbId: tmdbId.toString(),
      title: tmdbDetails.title || tmdbDetails.name || "Sconosciuto",
      adult: tmdbDetails.adult || false,
      poster_path: tmdbDetails.poster_path,
      original_title: tmdbDetails.original_title || tmdbDetails.original_name,
      original_language: tmdbDetails.original_language,
      original_country:
        tmdbDetails.production_countries?.map(
          (country: any) => country.iso_3166_1,
        ) || [],
      rating: tmdbDetails.vote_average,
      genres: tmdbDetails.genres?.map((genre: any) => genre.name) || [],
      description: tmdbDetails.overview,

      year:
        mediaType === "movie"
          ? tmdbDetails.release_date?.substring(0, 4)
            ? parseInt(tmdbDetails.release_date.substring(0, 4))
            : undefined
          : tmdbDetails.first_air_date?.substring(0, 4)
            ? parseInt(tmdbDetails.first_air_date.substring(0, 4))
            : undefined,
    };

    // Aggiungi campi specifici per i film
    if (mediaType === "movie") {
      mediaItem.release_date = tmdbDetails.release_date;
      mediaItem.duration = tmdbDetails.runtime;
    }

    // Aggiungi campi specifici per le serie TV
    if (mediaType === "tv") {
      mediaItem.first_air_date = tmdbDetails.first_air_date;
      mediaItem.last_air_date = tmdbDetails.last_air_date;
      mediaItem.episode_run_time = tmdbDetails.episode_run_time;
      mediaItem.number_of_seasons = tmdbDetails.number_of_seasons;
      mediaItem.number_of_episodes = tmdbDetails.number_of_episodes;
      mediaItem.in_production = tmdbDetails.in_production;
      mediaItem.languages = tmdbDetails.languages;

      // Mappa le stagioni se disponibili
      if (tmdbDetails.seasons && Array.isArray(tmdbDetails.seasons)) {
        mediaItem.seasons = tmdbDetails.seasons.map((season: any) => ({
          id: season.id,
          name: season.name,
          description: season.overview || "",
          season_number: season.season_number,
          episode_count: season.episode_count,
          air_date: season.air_date || "",
          poster_path: season.poster_path || "",
        }));
      }
    }

    debugLog(`Successfully created MediaItemType for: ${mediaItem.title}`);
    return mediaItem;
  } catch (error) {
    debugError(`Error creating MediaItemType from TMDB ID: ${tmdbId}`, error);
    throw error;
  }
};

/**
 * Crea un elemento MediaItemType automaticamente determinando il tipo di media
 * @param tmdbId - ID di TMDB
 * @param additionalData - Dati aggiuntivi opzionali
 * @returns Promise che risolve con l'elemento MediaItemType completo
 */
export const createItemFromTMDBidAuto = async (
  tmdbId: number,
  additionalData?: {
    downloadUrl?: string;
    size?: string;
    quality?: string;
  },
): Promise<MediaItemType> => {
  debugLog(`Auto-detecting media type for TMDB ID: ${tmdbId}`);

  try {
    // Prima prova come film
    try {
      const movieItem = await createItemFromTMDBid(
        tmdbId,
        "movie",
        additionalData,
      );
      debugLog(`Successfully identified as movie: ${movieItem.title}`);
      return movieItem;
    } catch {
      debugLog(`Not a movie, trying as TV series...`);

      // Se fallisce, prova come serie TV
      const tvItem = await createItemFromTMDBid(tmdbId, "tv", additionalData);
      debugLog(`Successfully identified as TV series: ${tvItem.title}`);
      return tvItem;
    }
  } catch (error) {
    debugError(`Failed to create MediaItemType for TMDB ID: ${tmdbId}`, error);
    throw new Error(
      `Unable to find media with TMDB ID: ${tmdbId}. It may not exist or there might be an API error.`,
    );
  }
};

// Esempio di utilizzo:
/*
// Crea un elemento da un ID TMDB specificando il tipo
const movieItem = await createItemFromTMDBid(550, "movie", {
  downloadUrl: "https://example.com/download",
  size: "1.5GB",
  quality: "1080p"
});

// Crea un elemento lasciando che il tipo venga determinato automaticamente
const autoItem = await createItemFromTMDBidAuto(1399, {
  downloadUrl: "https://example.com/download",
  size: "2.1GB",
  quality: "720p"
});

console.log(movieItem);
console.log(autoItem);
*/
