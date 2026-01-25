import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X } from "lucide-react";

interface RemoveButtonProps {
  removeFromQueue: (id: string) => void;
  id: string;
}

export const RemoveButton = ({ removeFromQueue, id }: RemoveButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => removeFromQueue(id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </TooltipTrigger>

      <TooltipContent>Elimina dalla lista</TooltipContent>
    </Tooltip>
  );
};
