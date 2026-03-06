import { formatRupiah } from "@/lib/format";

interface ProductInfoProps {
  title: string;
  price: number | string;
  description: string | null;
  category?: string;
}

export function ProductInfo({
  title,
  price,
  description,
  category,
}: ProductInfoProps) {
  return (
    <div className="flex flex-col">
      {/* Category — small muted text like Adidas */}
      {category && (
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          {category}
        </p>
      )}

      {/* Product name */}
      <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black leading-tight mb-5">
        {title}
      </h1>

      {/* Price */}
      <p className="text-xl font-bold text-black mb-6">{formatRupiah(price)}</p>

      {/* Thin separator */}
      <div className="h-px w-full bg-gray-200 mb-6" />

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          {description}
        </p>
      )}
    </div>
  );
}
