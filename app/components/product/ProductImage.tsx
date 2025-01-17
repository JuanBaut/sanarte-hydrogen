import { Image } from "@shopify/hydrogen";
import React, { useEffect } from "react";
import { ProductFragment } from "storefrontapi.generated";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export function ProductImage({
  images,
}: {
  images: ProductFragment["images"]["edges"];
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!images) {
    return null;
  }

  return (
    <Carousel setApi={setApi} className="size-fit basis-3/5 space-y-2">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.node.id}>
            <Image
              className="rounded-lg"
              alt={image.node.altText || "Product Image"}
              aspectRatio="1/1"
              data={image.node}
              sizes="(min-width: 45em) 50vw, 100vw"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex w-full justify-between gap-2 rounded-lg border border-border/70 px-4 py-2">
        <div className="space-x-2">
          <CarouselPrevious className="static transform-none" />
          <CarouselNext className="static transform-none" />
        </div>
        <span className="self-center text-sm text-foreground/70">
          Imagen {current} de {count}
        </span>
      </div>
    </Carousel>
  );
}
