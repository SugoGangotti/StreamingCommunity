import type { MediaItemType } from "./MediaItemType";

export type QueueItemType = MediaItemType & {
  status: "pending" | "downloading" | "completed" | "error";
  progress?: number;
  downloadSpeed?: string;
  estimatedTime?: string;
  addedAt: Date;
};
