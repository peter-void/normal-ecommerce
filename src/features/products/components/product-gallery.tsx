"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface ProductGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

function GalleryImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  return (
    <div
      className="relative w-full h-full bg-gray-100 overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        className="object-cover transition-transform duration-200 ease-out"
        style={{
          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
          transform: isHovering ? "scale(2)" : "scale(1)",
        }}
      />
    </div>
  );
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [showAll, setShowAll] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
        <span className="text-neutral-400 text-xs font-bold uppercase tracking-widest">
          No Image Available
        </span>
      </div>
    );
  }

  const hasMore = images.length > 4;
  const visibleImages = hasMore && !showAll ? images.slice(0, 4) : images;
  const n = visibleImages.length;

  // ─── Smart layout based on image count ───────────────────────────────────
  //  1 image  → full width square
  //  2 images → 2 side-by-side squares
  //  3 images → 2 on top (side-by-side) + 1 full-width on bottom
  //  4 images → 2×2 grid  (2 on top, 2 on bottom)
  //  5+       → first 4 as above, rest collapsed behind "show more"
  // ──────────────────────────────────────────────────────────────────────────

  if (n === 1) {
    return (
      <div className="flex flex-col">
        <div className="w-full aspect-square">
          <GalleryImage
            src={visibleImages[0].src}
            alt={visibleImages[0].alt}
            priority
          />
        </div>
      </div>
    );
  }

  if (n === 2) {
    return (
      <div className="flex flex-col gap-[2px]">
        <div className="grid grid-cols-2 gap-[2px]">
          {visibleImages.map((img, i) => (
            <div key={i} className="aspect-square">
              <GalleryImage src={img.src} alt={img.alt} priority={i === 0} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3 images: 2 top + 1 full bottom
  if (n === 3) {
    return (
      <div className="flex flex-col gap-[2px]">
        <div className="grid grid-cols-2 gap-[2px]">
          {visibleImages.slice(0, 2).map((img, i) => (
            <div key={i} className="aspect-square">
              <GalleryImage src={img.src} alt={img.alt} priority={i === 0} />
            </div>
          ))}
        </div>
        <div className="w-full aspect-[2/1]">
          <GalleryImage src={visibleImages[2].src} alt={visibleImages[2].alt} />
        </div>
      </div>
    );
  }

  // 4+ images: 2-col pairs, show-more if > 4
  // Group into rows of 2
  const pairs: (typeof images)[] = [];
  for (let i = 0; i < visibleImages.length; i += 2) {
    pairs.push(visibleImages.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col gap-[2px]">
      {pairs.map((pair, pairIndex) => (
        <div
          key={pairIndex}
          className={`gap-[2px] ${pair.length === 1 ? "w-full" : "grid grid-cols-2"}`}
        >
          {pair.map((img, i) => (
            <div key={i} className="aspect-square">
              <GalleryImage
                src={img.src}
                alt={img.alt}
                priority={pairIndex === 0 && i === 0}
              />
            </div>
          ))}
        </div>
      ))}

      {/* Tampilkan lebih banyak — Adidas style */}
      {hasMore && !showAll && (
        <div className="relative flex items-center justify-center py-1">
          <div className="absolute inset-x-1/2 top-0 bottom-0 w-px bg-gray-300 -translate-x-1/2" />
          <button
            onClick={() => setShowAll(true)}
            className="relative z-10 flex items-center gap-2 bg-white border border-gray-300 px-8 py-4 text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-50 transition-colors"
          >
            Tampilkan lebih banyak
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
