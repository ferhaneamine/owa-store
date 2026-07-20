import Image from "next/image";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

export default function ProductImage({
  url,
  alt,
  label,
  seed,
  className,
  sizes,
}: {
  url?: string;
  alt: string;
  label: string;
  seed?: string;
  className?: string;
  sizes?: string;
}) {
  if (url) {
    return (
      <div className={`relative ${className ?? ""}`}>
        <Image
          src={url}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
          className="object-cover"
        />
      </div>
    );
  }
  return <ImagePlaceholder label={label} seed={seed} className={className} />;
}
