import type { MediaItemType } from "@/types/MediaItemType";

export const getTypeColor = (type: MediaItemType["type"]) => {
  switch (type) {
    case "movie":
      return "bg-blue-500";
    case "series":
      return "bg-green-500";
    case "anime":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};
