export type MediaItem = {
  id: string;
  title: string;
  type: "movie" | "series" | "anime" | "documentary";
  description: string;
  year: number;
  rating: number;
  duration?: string;
  seasons?: number;
  size: string;
  quality: string;
  image: string;
  downloadUrl: string;
};
