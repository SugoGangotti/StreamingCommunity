import type { QueueItemType } from "@/types/QueueItemType";
import { GripVertical, FileClock } from "lucide-react";

interface LeftIconProps {
  item: QueueItemType;
}

const CorrectIcon = ({ item }: LeftIconProps) => {
  if (item.status === "completed") {
    return (
      <div className="text-lg font-bold text-green-500 w-8 text-center">✓</div>
    );
  } else if (item.status === "error") {
    return (
      <div className="text-lg font-bold text-red-500 w-8 text-center">!</div>
    );
  } else if (item.status === "pending") {
    return <GripVertical className="h-5 w-5 text-gray-400" />;
  } else if (item.status === "downloading") {
    return <FileClock className="h-5 w-5 text-gray-400" />;
  }

  return "";
};

export const LeftIcon = ({ item }: LeftIconProps) => {
  return <div className="flex items-center gap-2">{CorrectIcon({ item })}</div>;
};
