import { Button } from "@/components/ui/button";
import { Pause } from "lucide-react";
import type { QueueItemType } from "@/types/QueueItemType";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PauseButtonProps {
  togglePauseResume: (id: string) => void;
  item: QueueItemType;
}

const PauseButton = ({ togglePauseResume, item }: PauseButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          size="icon"
          variant="default"
          onClick={() => togglePauseResume(item.id)}
        >
          <Pause className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Metti in pausa il download</TooltipContent>
    </Tooltip>
  );
};

export default PauseButton;
