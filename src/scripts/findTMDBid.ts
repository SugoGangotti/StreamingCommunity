/* eslint-disable @typescript-eslint/no-explicit-any */
import { debugLog, debugError } from "./debug";
import type { SettingsStateType } from "@/types/SettingsStateType";

// Interfacce per i risultati TMDB
export interface TMDBSearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  released?: string;
  poster_path?: string;
  overview?: string;
  popularity?: number;
}

export interface TMDBSearchResponse {
  results: TMDBSearchResult[];
  total_results: number;
  total_pages: number;
}

// Configurazione API TMDB
let TMDB_API_KEY: string | undefined;

/**
 * Inizializza la API key di TMDB dai settings
 * @param settings - Oggetto settings contenente tmdb_api_key
 */
export const initializeTMDBKey = (settings: SettingsStateType): void => {
  TMDB_API_KEY = settings.tmdb_api_key?.value || settings.tmdb_api_key;
  debugLog(
    "TMDB API key initialized",
    TMDB_API_KEY ? "Key set" : "Key missing",
  );
};

/**
 * Ottiene la API key corrente di TMDB
 * @returns API key o undefined se non impostata
 */
const getTMDBApiKey = (): string | undefined => {
  return TMDB_API_KEY;
};
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Trova l'ID di TMDB partendo dal nome di un film o serie TV
 * @param query - Nome del film o serie TV da cercare
 * @param mediaType - Tipo di media ('movie', 'tv' o 'all' per entrambi)
 * @param year - Anno opzionale per filtrare i risultati
 * @param minPopularity - Popolarità minima opzionale per filtrare i risultati
 * @returns Promise che risolve con l'array dei risultati trovati
 */
export const findTMDBId = async (
  query: string,
  mediaType: "movie" | "tv" | "all" = "all",
  year?: number,
  minPopularity?: number,
): Promise<TMDBSearchResult[]> => {
  debugLog(`Searching TMDB for: "${query}"`, {
    mediaType,
    year,
    minPopularity,
  });

  const apiKey = getTMDBApiKey();

  if (!query.trim()) {
    debugError("Empty query provided");
    return [];
  }

  if (!apiKey) {
    debugError("TMDB API key not configured");
    throw new Error(
      "TMDB API key not configured. Please set your API key in settings.",
    );
  }

  try {
    // Costruisci l'URL della ricerca
    let searchUrl = `${TMDB_BASE_URL}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=it-IT`;

    if (year) {
      searchUrl += `&year=${year}`;
    }

    debugLog(`Making request to: ${searchUrl}`);

    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`,
      );
    }

    const data: TMDBSearchResponse = await response.json();
    debugLog(`Found ${data.results.length} results`);

    // Filtra i risultati in base al media_type se specificato
    let filteredResults = data.results;
    if (mediaType !== "all") {
      filteredResults = data.results.filter(
        (result) => result.media_type === mediaType,
      );
    }

    // Filtra per popolarità minima se specificata
    if (minPopularity !== undefined) {
      filteredResults = filteredResults.filter(
        (result) => (result.popularity || 0) >= minPopularity,
      );
    }

    // Ordina per popolarità (decrescente) e poi per rilevanza (prima i risultati con poster)
    filteredResults.sort((a, b) => {
      // Prima ordina per popolarità
      const popDiff = (b.popularity || 0) - (a.popularity || 0);
      if (popDiff !== 0) return popDiff;

      // Se popolarità è uguale, ordina per presenza del poster
      if (a.poster_path && !b.poster_path) return -1;
      if (!a.poster_path && b.poster_path) return 1;
      return 0;
    });

    debugLog(
      `Filtered to ${filteredResults.length} results for media type: ${mediaType}`,
    );

    return filteredResults;
  } catch (error) {
    debugError("Error searching TMDB", error);
    throw error;
  }
};

/**
 * Trova l'ID di TMDB e restituisce solo il primo risultato
 * @param query - Nome del film o serie TV da cercare
 * @param mediaType - Tipo di media ('movie', 'tv' o 'all')
 * @param year - Anno opzionale per filtrare i risultati
 * @param minPopularity - Popolarità minima opzionale per filtrare i risultati
 * @returns Promise che risolve con il primo risultato o null
 */
export const findFirstTMDBId = async (
  query: string,
  mediaType: "movie" | "tv" | "all" = "all",
  year?: number,
  minPopularity?: number,
): Promise<TMDBSearchResult | null> => {
  try {
    const results = await findTMDBId(query, mediaType, year, minPopularity);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    debugError("Error getting first TMDB result", error);
    return null;
  }
};

/**
 * Ottiene i dettagli completi di un film/serie TV da TMDB
 * @param tmdbId - ID di TMDB
 * @param mediaType - Tipo di media ('movie' o 'tv')
 * @returns Promise che risolve con i dettagli completi
 */
export const getTMDBDetails = async (
  tmdbId: number,
  mediaType: "movie" | "tv",
): Promise<any> => {
  debugLog(`Getting details for TMDB ID: ${tmdbId}, type: ${mediaType}`);

  const apiKey = getTMDBApiKey();

  if (!apiKey) {
    debugError("TMDB API key not configured");
    throw new Error(
      "TMDB API key not configured. Please set your API key in settings.",
    );
  }

  try {
    const url = `${TMDB_BASE_URL}/${mediaType}/${tmdbId}?api_key=${apiKey}&language=it-IT`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`,
      );
    }

    const details = await response.json();
    debugLog(`Details retrieved for ${mediaType} ID: ${tmdbId}`);

    return details;
  } catch (error) {
    debugError(`Error getting details for TMDB ID: ${tmdbId}`, error);
    throw error;
  }
};

/**
 * Funzione helper per formattare i risultati della ricerca
 * @param results - Array dei risultati TMDB
 * @returns Array formattato con informazioni utili
 */
export const formatTMDBResults = (
  results: TMDBSearchResult[],
): Array<{
  id: number;
  title: string;
  type: string;
  year?: string;
  posterUrl?: string;
  overview?: string;
}> => {
  return results.map((result) => ({
    id: result.id,
    title: result.title || result.name || "Sconosciuto",
    type: result.media_type === "movie" ? "Film" : "Serie TV",
    year:
      result.release_date?.substring(0, 4) ||
      result.first_air_date?.substring(0, 4),
    posterUrl: result.poster_path
      ? `https://image.tmdb.org/t/p/w200${result.poster_path}`
      : undefined,
    overview: result.overview,
  }));
};

// Esempio di utilizzo:
/*
// Trova tutti i risultati per "Inception"
const results = await findTMDBId("Inception");

// Trova solo film per "The Matrix" del 1999
const movieResults = await findTMDBId("The Matrix", "movie", 1999);

// Trova il primo risultato per "Stranger Things"
const firstResult = await findFirstTMDBId("Stranger Things", "tv");

// Ottieni dettagli completi
if (firstResult) {
  const details = await getTMDBDetails(firstResult.id, firstResult.media_type);
  console.log(details);
}

// Formatta i risultati per display
const formattedResults = formatTMDBResults(results);
console.log(formattedResults);
*/
