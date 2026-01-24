/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TrendingItem {
  title: string;
  poster: string;
  url: string;
  year: number;
}

export const fetchTrendingData = async (): Promise<TrendingItem[]> => {
  // Get TMDB config from apis-config.json
  try {
    const response = await fetch("/src/config/apis-config.json");
    if (!response.ok) {
      throw new Error("Failed to load APIs config");
    }
    const config = await response.json();
    const TMDB_API_KEY = config.tmdb_api_key || "";
    const TMDB_BASE_URL =
      config.tmdb_base_url || "https://api.themoviedb.org/3";

    if (!TMDB_API_KEY) {
      throw new Error(
        "TMDB API key non configurata. Vai nelle impostazioni per aggiungerla.",
      );
    }

    const tmdbResponse = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=it-IT`,
    );

    if (!tmdbResponse.ok) {
      throw new Error(`TMDB API failed: ${tmdbResponse.status}`);
    }

    const data = await tmdbResponse.json();

    return data.results.slice(0, 20).map((movie: any) => ({
      title: movie.title,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : `https://picsum.photos/300/450?random=${movie.id}`,
      url: `https://www.themoviedb.org/movie/${movie.id}/`,
      year: movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : 2024,
    }));
  } catch (error) {
    console.error("Error loading TMDB config:", error);
    return [];
  }
};

export const getFallbackTrendingData = (): TrendingItem[] => [];
