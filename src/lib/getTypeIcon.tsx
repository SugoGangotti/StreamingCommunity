import type { MediaItemType } from "@/types/MediaItemType";
import { Film, Star, Tv } from "lucide-react";

export const getTypeIcon = (type: MediaItemType["type"]) => {
  switch (type) {
    case "movie":
      return <Film className="h-4 w-4" />;
    case "series":
      return <Tv className="h-4 w-4" />;
    case "anime":
      return <Star className="h-4 w-4" />;
    default:
      return <Film className="h-4 w-4" />;
  }
};
