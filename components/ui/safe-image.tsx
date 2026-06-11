"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { isRemoteImageUrlAllowed } from "@/lib/config/remote-image-patterns";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import { cn } from "@/lib/utils";

export interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src?: string | null;
  fallbackSrc?: string;
  fallbackClassName?: string;
}

export function SafeImage({
  src,
  fallbackSrc,
  alt,
  className,
  fallbackClassName,
  fill,
  sizes,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const resolvedSrc = formatImageUrl(src);
  const resolvedSizes = sizes ?? (fill ? "100vw" : undefined);

  if (!resolvedSrc || error) {
    if (fallbackSrc) {
      return (
        <Image
          src={fallbackSrc}
          alt={alt}
          fill={fill}
          sizes={resolvedSizes}
          className={cn(className, fallbackClassName)}
          {...props}
        />
      );
    }
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground text-xs",
          fill && "absolute inset-0 size-full",
          className,
          fallbackClassName,
        )}
        aria-label={alt}
      />
    );
  }

  if (!isRemoteImageUrlAllowed(resolvedSrc)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt={alt}
        className={cn(fill && "absolute inset-0 size-full", className)}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill={fill}
      sizes={resolvedSizes}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
