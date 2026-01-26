export type FoundMediaItemType = {
  id: string;
  type: "movie" | "series" | "anime";
  size: string;
  quality: string;
  downloadUrl: string;

  title: string;
  release_date?: string;
  duration?: number;
  year?: number;
  seasons?: number;
};
