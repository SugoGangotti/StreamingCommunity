import type { QueueItemType } from "@/types/QueueItemType";
import { AlertCircle, CheckCircle, Clock, FileQuestion } from "lucide-react";

export const getStatusIcon = (status: QueueItemType["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-gray-500" />;
    default:
      return <FileQuestion className="h-4 w-4 text-gray-500" />;
  }
};
