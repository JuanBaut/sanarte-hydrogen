import { Image } from "@shopify/hydrogen";
import type { ProductVariantFragment } from "storefrontapi.generated";

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment["image"];
}) {
  if (!image) {
    return <div />;
  }

  return (
    <div className="size-fit basis-3/5">
      <Image
        className="rounded-lg"
        alt={image.altText || "Product Image"}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}
