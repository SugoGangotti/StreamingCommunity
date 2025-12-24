import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/carousel";

import { Card, CardContent } from "./ui/card";

import Autoplay from "embla-carousel-autoplay";
import {
  fetchTrendingData,
  getFallbackTrendingData,
  type TrendingItem,
} from "@/lib/tmdb-api";

const TrendingBanner = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [trendingData, setTrendingData] = React.useState<TrendingItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadTrendingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const items = await fetchTrendingData();

      // If no items from API, use fallback data
      if (items.length === 0) {
        setTrendingData(getFallbackTrendingData());
      } else {
        setTrendingData(items);
      }
    } catch (err) {
      console.error("Error loading trending data:", err);
      setError("Failed to load trending data");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadTrendingData();
  }, []);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto flex flex-col">
      {loading ? (
        <div className="max-w-[80vw] mx-auto">
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="basis-1/3">
                <div className="w-full aspect-2/3 bg-gray-200 animate-pulse rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="max-w-[80vw] mx-auto text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={loadTrendingData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <Carousel
          setApi={setApi}
          className="max-w-[80vw] flex flex-row"
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselPrevious />

          <CarouselContent className="w-full">
            {trendingData.map((item, index) => (
              <CarouselItem key={index} className="basis-1/3">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <Card className="w-full aspect-2/3 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300">
                    {/* Hidden img to test if image loads */}
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="hidden"
                      onError={(e) => {
                        // If image fails to load, update the background div
                        const card = (e.target as HTMLImageElement)
                          .nextElementSibling as HTMLDivElement;
                        if (card) {
                          card.style.backgroundImage = `url(https://cdn.dribbble.com/userupload/21148888/file/original-6bad51f87ee3532bc3cfaeef7921c674.png?resize=752x&vertical=center)`;
                        }
                      }}
                      onLoad={(e) => {
                        // If image loads successfully, ensure it's set as background
                        const card = (e.target as HTMLImageElement)
                          .nextElementSibling as HTMLDivElement;
                        if (card) {
                          card.style.backgroundImage = `url(${item.poster})`;
                        }
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${item.poster})`,
                        backgroundColor: "#374151",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                    <CardContent className="w-full h-full flex flex-col items-center justify-end p-4 relative z-10">
                      <span className="text-white text-lg font-bold text-center drop-shadow-lg">
                        {index + 1}. {item.title}
                      </span>
                    </CardContent>
                  </Card>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselNext />
        </Carousel>
      )}

      {!loading && !error && (
        <div className="text-muted-foreground py-2 text-center text-sm">
          Slide {current} of {count}
        </div>
      )}
    </div>
  );
};

export default TrendingBanner;
