"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight, Fullscreen, Maximize2 } from "lucide-react";

interface ProductGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

function ZoomableImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority: boolean;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      className="relative aspect-square w-full overflow-hidden cursor-crosshair bg-white group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className="object-contain p-8 transition-transform duration-200 ease-out"
        style={{
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
          transform: isHovering ? "scale(2.5)" : "scale(1)",
        }}
        priority={priority}
      />

      {/* Instruction Overlay (fades out on hover) */}
      <div
        className={cn(
          "absolute bottom-4 right-4 pointer-events-none transition-opacity duration-300",
          isHovering ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="bg-black text-white text-xs font-bold uppercase px-2 py-1 flex items-center gap-1">
          <Maximize2 className="w-3 h-3" /> Hover to Zoom
        </div>
      </div>
    </div>
  );
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!mainApi) {
      return;
    }

    const onSelect = () => {
      const selectedIndex = mainApi.selectedScrollSnap();
      setCurrent(selectedIndex);
      thumbnailApi?.scrollTo(selectedIndex);
    };

    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);

    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, thumbnailApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi]
  );

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-neutral-100 flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-neutral-400 font-bold uppercase">
          No Image Available
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Carousel
          setApi={setMainApi}
          className="w-full bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-10"
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <ZoomableImage
                  src={image.src}
                  alt={image.alt || "Product image"}
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-4 h-12 w-12 border-4 border-black bg-white hover:bg-yellow-400 text-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20" />
          <CarouselNext className="right-4 h-12 w-12 border-4 border-black bg-white hover:bg-yellow-400 text-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20" />
        </Carousel>

        {/* Decorative Back Layer */}
        <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 z-0" />
      </div>

      <div className="mx-auto w-full px-1">
        <Carousel
          setApi={setThumbnailApi}
          opts={{
            align: "start",
            containScroll: "keepSnaps",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 pb-4">
            {images.map((image, index) => (
              <CarouselItem key={index} className="basis-1/5 pl-4 min-w-0">
                <button
                  type="button"
                  onClick={() => onThumbClick(index)}
                  className={cn(
                    "relative aspect-square w-full border-4 overflow-hidden transition-all duration-200",
                    current === index
                      ? "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-4px]"
                      : "border-transparent opacity-70 hover:opacity-100 hover:border-black hover:bg-white"
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-contain p-2"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
