import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import type { QueueItemType } from "@/types/QueueItemType";
import RelatedButtons from "./subcomp/relatedButtons";
import { getStatusBadge } from "@/lib/getStatusBadge";
import ImageCustom from "../imageCustom";
import { Badge } from "../ui/badge";
import CustomDescription from "../customDescription";

interface InDownloadCardProps {
  downloadingItems: QueueItemType[];
  removeFromQueue: (id: string) => void;
  retryDownload: (id: string) => void;
  togglePauseResume: (id: string) => void;
}

const InDownloadCard = ({
  downloadingItems,
  removeFromQueue,
  retryDownload,
  togglePauseResume,
}: InDownloadCardProps) => {
  return downloadingItems.map((item) => (
    <Card
      className="p-6 flex flex-row"
      key={item.id}
      style={{
        backgroundImage:
          item.progress !== undefined
            ? `linear-gradient(to right, rgb(59 130 246 / 0.1) 0%, rgb(59 130 246 / 0.1) ${item.progress}%, transparent ${item.progress}%, transparent 100%)`
            : undefined,
      }}
    >
      <div className="w-1/5 rounded-2xl overflow-hidden">
        <ImageCustom
          tmdbId={item.tmdbId}
          alt={item.title}
          mediaType={
            item.type === "series"
              ? "tv"
              : item.type === "movie"
                ? "movie"
                : "anime"
          }
        />
      </div>

      <div className="w-4/5 flex flex-col h-full gap-2">
        <CardHeader className="text-xl font-semibold p-1 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            {item.title}

            {getStatusBadge(item.status)}
          </div>

          <div className="flex gap-2">
            <Badge>{item.quality}</Badge>
            <Badge>{item.size}</Badge>
          </div>
        </CardHeader>

        <CardContent className="h-full">
          <CardDescription className="h-full">
            <CustomDescription
              tmdbId={item.tmdbId}
              mediaType={
                item.type === "series"
                  ? "tv"
                  : item.type === "movie"
                    ? "movie"
                    : "anime"
              }
            />
          </CardDescription>
        </CardContent>

        <CardFooter className="w-full justify-between mb-auto items-center p-1">
          <div className="flex gap-2">
            <Badge>{item.downloadSpeed}</Badge>

            <Badge>{item.estimatedTime}</Badge>

            <Badge>{item.progress}%</Badge>
          </div>

          <RelatedButtons
            removeFromQueue={removeFromQueue}
            item={item}
            retryDownload={retryDownload}
            togglePauseResume={togglePauseResume}
          />
        </CardFooter>
      </div>
    </Card>
  ));
};

export default InDownloadCard;
