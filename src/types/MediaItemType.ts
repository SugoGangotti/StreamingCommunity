export type MediaItemType = {
  id: string;
  type: "movie" | "series" | "anime";
  size: string;
  quality: string;
  downloadUrl: string;

  tmdbId: string;
  title: string;
  adult?: boolean;
  poster_path?: string;
  original_title?: string;
  original_language?: string;
  original_country?: string[];
  rating?: number;
  genres?: string[];
  description?: string;

  // Common fields
  year?: number;

  // Movie specific fields
  release_date?: string;
  duration?: number | string; // Support both number (minutes) and string format

  // Series specific fields
  first_air_date?: string;
  last_air_date?: string;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: SeasonInfo[] | number; // Support both old and new format
  in_production?: boolean;
  languages?: string[];
};

export interface SeasonInfo {
  id: number;
  name: string;
  description: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  poster_path: string;
}

export interface EpisodeInfo {
  id: number;
  name: string;
  description: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  runtime: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}
