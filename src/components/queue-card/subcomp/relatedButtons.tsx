import { Button } from "@/components/ui/button";
import { RemoveButton } from "./special-buttons/removeButton";
import { RetryButton } from "./special-buttons/retryButton";
import type { QueueItemType } from "@/types/QueueItemType";
import { Play } from "lucide-react";
import PauseButton from "./special-buttons/pauseButton";

interface RelatedButtonsProps {
  removeFromQueue: (id: string) => void;
  item: QueueItemType;
  retryDownload: (id: string) => void;
  togglePauseResume: (id: string) => void;
}

const RelatedButtons = ({
  removeFromQueue,
  item,
  retryDownload,
  togglePauseResume,
}: RelatedButtonsProps) => {
  return (
    <div className="flex gap-2 items-center">
      {item.status === "downloading" && (
        <PauseButton togglePauseResume={togglePauseResume} item={item} />
      )}

      {item.status === "pending" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => togglePauseResume(item.id)}
        >
          <Play className="h-4 w-4" />
        </Button>
      )}

      {item.status === "error" && (
        <RetryButton item={item} retryDownload={retryDownload} />
      )}

      <RemoveButton removeFromQueue={removeFromQueue} id={item.id} />
    </div>
  );
};

export default RelatedButtons;
