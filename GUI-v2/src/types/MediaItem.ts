export type MediaItem = {
  id: string;
  display_title: string;
  display_type: "Film" | "Serie TV" | "Anime";
  source: string;
  source_alias: string;
  display_release?: string;
  bg_image_url?: string;
};
