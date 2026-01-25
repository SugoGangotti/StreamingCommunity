import { Button } from "@/components/ui/button";
import { RotateCwSquare } from "lucide-react";
import type { QueueItemType } from "@/types/QueueItemType";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RetryButtonProps {
  retryDownload: (id: string) => void;
  item: QueueItemType;
}

export const RetryButton = ({ retryDownload, item }: RetryButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          size="icon"
          variant="default"
          onClick={() => retryDownload(item.id)}
        >
          <RotateCwSquare className="h-4 w-4" />
        </Button>
      </TooltipTrigger>

      <TooltipContent>Riprova download</TooltipContent>
    </Tooltip>
  );
};
