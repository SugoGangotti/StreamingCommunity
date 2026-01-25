import type { QueueItemType } from "@/types/QueueItemType";

import { getStatusBadge } from "@/lib/getStatusBadge";
import { Card } from "../ui/card";
import { LeftIcon } from "./subcomp/leftIcon";
import RelatedButtons from "./subcomp/relatedButtons";
import { ItemInfo } from "./subcomp/itemInfo";

interface QueueCardProps {
  item: QueueItemType;
  removeFromQueue: (id: string) => void;
  retryDownload: (id: string) => void;
  togglePauseResume: (id: string) => void;
  handleDragStart: (e: React.DragEvent, id: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragEnter: (id: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, id: string) => void;
  handleDragEnd: () => void;
  dragOverItem: string | null;
  draggedItem: string | null;
}

const getCardProps = (
  status: string,
  handleDragStart: (e: React.DragEvent, id: string) => void,
  handleDragOver: (e: React.DragEvent) => void,
  handleDragEnter: (id: string) => void,
  handleDragLeave: () => void,
  handleDrop: (e: React.DragEvent, id: string) => void,
  handleDragEnd: () => void,
  item: QueueItemType,
  dragOverItem: string | null,
  draggedItem: string | null,
) => {
  switch (status) {
    case "pending":
      return {
        draggable: true,
        onDragStart: (e: React.DragEvent) => handleDragStart(e, item.id),
        onDragOver: handleDragOver,
        onDragEnter: () => handleDragEnter(item.id),
        onDragLeave: handleDragLeave,
        onDrop: (e: React.DragEvent) => handleDrop(e, item.id),
        onDragEnd: handleDragEnd,
        className: `
          relative bg-card border rounded-lg p-4 transition-all flex-1
          cursor-move hover:shadow-md
          ${dragOverItem === item.id ? "border-blue-500 bg-blue-50/50" : ""}
          ${draggedItem === item.id ? "opacity-50" : ""}
        `,
      };
    case "downloading":
      return {
        draggable: false,
        className: `
          relative bg-card border rounded-lg p-4 transition-all flex-1
          cursor-not-allowed opacity-90 overflow-hidden
          ${dragOverItem === item.id ? "border-blue-500 bg-blue-50/50" : ""}
          ${draggedItem === item.id ? "opacity-50" : ""}
        `,
        style: {
          backgroundImage:
            item.progress !== undefined
              ? `linear-gradient(to right, rgb(59 130 246 / 0.1) 0%, rgb(59 130 246 / 0.1) ${item.progress}%, transparent ${item.progress}%, transparent 100%)`
              : undefined,
        },
      };
    default:
      return {
        className: "relative p-4 transition-all",
      };
  }
};

const QueueCard = ({
  item,
  removeFromQueue,
  retryDownload,
  togglePauseResume,
  handleDragStart,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
  handleDragEnd,
  dragOverItem,
  draggedItem,
}: QueueCardProps) => {
  return (
    <Card
      key={item.id}
      {...getCardProps(
        item.status,
        handleDragStart,
        handleDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        handleDragEnd,
        item,
        dragOverItem,
        draggedItem,
      )}
    >
      <div className="flex items-center gap-4">
        {/* Type Icon */}
        <LeftIcon item={item} />

        {/* Item Info */}
        <ItemInfo item={item} />

        {/* Status Badge */}
        <div className="flex items-center gap-4">
          {getStatusBadge(item.status)}

          <RelatedButtons
            removeFromQueue={removeFromQueue}
            item={item}
            retryDownload={retryDownload}
            togglePauseResume={togglePauseResume}
          />
        </div>
      </div>
    </Card>
  );
};

export default QueueCard;
