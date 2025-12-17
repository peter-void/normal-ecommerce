import { Badge } from "@/components/ui/badge";
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
    <div className="flex flex-col gap-6">
      {category && (
        <div className="relative w-fit">
          <div className="absolute inset-0 bg-black translate-x-[2px] translate-y-[2px]" />
          <Badge className="relative border-2 border-black bg-yellow-400 text-black font-black uppercase text-xs px-3 py-1 rounded-none hover:bg-yellow-500 hover:text-black hover:border-black transition-transform hover:-translate-y-px">
            {category}
          </Badge>
        </div>
      )}

      <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-black leading-[0.9] wrap-break-word">
        {title}
      </h1>

      <div className="flex items-center gap-4 border-b-4 border-black border-dashed pb-6">
        <div className="bg-black text-white px-4 py-2 transform -rotate-1">
          <span className="text-4xl font-black tracking-tight">
            {formatRupiah(price)}
          </span>
        </div>
      </div>

      <div className="prose prose-lg prose-neutral max-w-none text-neutral-800 font-medium">
        <p className="leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
