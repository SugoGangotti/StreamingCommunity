import { Star, DownloadIcon, Calendar, Clock, Tv } from "lucide-react";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import type { MediaItemType } from "@/types/MediaItemType";
import { Badge } from "./ui/badge";

import { getTypeColor } from "@/lib/getTypeColor";
import { getTypeIcon } from "@/lib/getTypeIcon";

interface MediaItemProps {
  item: MediaItemType;
}

const MediaItem = ({ item }: MediaItemProps) => {
  return (
    <Card
      key={item.id}
      className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-2/3 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <Badge className={`${getTypeColor(item.type)} text-white text-xs`}>
            {getTypeIcon(item.type)}
            <span className="ml-1">{item.type}</span>
          </Badge>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/70 text-white">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {item.rating}
          </Badge>
        </div>

        {/* Download Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            size="lg"
            className="transform scale-90 group-hover:scale-100 transition-transform"
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{item.year}</span>
          {item.duration && (
            <>
              <Clock className="h-3 w-3 ml-2" />
              <span>{item.duration}</span>
            </>
          )}
          {item.seasons && (
            <>
              <Tv className="h-3 w-3 ml-2" />
              <span>{item.seasons} seasons</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {item.quality}
            </Badge>
            <span className="text-xs text-muted-foreground">{item.size}</span>
          </div>
          <DownloadIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaItem;
