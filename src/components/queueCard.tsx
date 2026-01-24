import { X } from "lucide-react";
import { Button } from "./ui/button";
import type { QueueItemType } from "@/types/QueueItemType";

import { getTypeColor } from "@/lib/getTypeColor";
import { getTypeIcon } from "@/lib/getTypeIcon";

interface QueueCardProps {
  id: string;
  item: QueueItemType;
}

const queueCard = ({ id, item }: QueueCardProps) => {
  return (
    <div
      key={id}
      className="relative bg-card border rounded-lg p-4 transition-all opacity-75"
    >
      <div className="flex items-center gap-4">
        {/* Number */}
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold text-green-500 w-8 text-center">
            ✓
          </div>
        </div>

        {/* Type Icon */}
        <div
          className={`p-2 rounded-full ${getTypeColor(item.type)} bg-opacity-20`}
        >
          {getTypeIcon(item.type)}
        </div>

        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{item.title}</h3>
            {getStatusIcon(item.status)}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{item.size}</span>
            <span>{item.quality}</span>
            <span>Completato: {item.addedAt.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {getStatusBadge(item.status)}

          <Button
            size="sm"
            variant="outline"
            onClick={() => removeFromQueue(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default queueCard;
