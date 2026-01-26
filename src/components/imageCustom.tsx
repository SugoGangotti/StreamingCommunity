import React, { useState } from "react";
import { ImageOff } from "lucide-react";

interface ImageCustomProps {
  posterPath?: string;
  baseUrl?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

const ImageCustom: React.FC<ImageCustomProps> = ({
  posterPath,
  baseUrl = "https://image.tmdb.org/t/p/w500",
  alt,
  className = "",
  width,
  height,
  aspectRatio = "2/3",
}) => {
  const [hasError, setHasError] = useState(false);

  const imgSrc = posterPath ? `${baseUrl}${posterPath}` : null;
  const showFallback = !imgSrc || hasError;

  return (
    <div
      className={`relative bg-card-foreground ${className}`}
      style={{
        aspectRatio: aspectRatio,
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "auto",
      }}
    >
      {showFallback ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-gray-600" />
        </div>
      ) : (
        <img
          src={imgSrc!}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};

export default ImageCustom;
