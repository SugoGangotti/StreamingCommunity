import { Badge } from "@/components/ui/badge";
import { getStatusIcon } from "@/lib/getStatusIcon";
import type { QueueItemType } from "@/types/QueueItemType";

interface ItemInfoProps {
  item: QueueItemType;
}

export const ItemInfo = ({ item }: ItemInfoProps) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold truncate">{item.title}</h3>
        {getStatusIcon(item.status)}
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="whitespace-nowrap">{item.size}</span>
        <span className="whitespace-nowrap">{item.quality}</span>
        {item.status === "completed" && (
          <span>Completato: {item.addedAt.toLocaleTimeString()}</span>
        )}
        {item.status === "error" && (
          <span>Codice Errore: {item.errorCode}</span>
        )}

        {item.status === "downloading" && item.progress !== undefined && (
          <>
            <Badge>
              <span>{item.progress}%</span>
            </Badge>

            <Badge>
              <span>{item.downloadSpeed}</span>
            </Badge>

            <Badge>
              <span>{item.estimatedTime}</span>
            </Badge>
          </>
        )}
      </div>
    </div>
  );
};
