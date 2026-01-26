export type MediaItemType = {
  id: string;
  title: string;
  type: "movie" | "series" | "anime";
  year?: number;
  duration?: string;
  seasons?: number;
  size: string;
  quality: string;
  downloadUrl: string;
  tmdbId: string;
};
