import { Image } from "@shopify/hydrogen";
import React, { useCallback, useEffect } from "react";
import { ProductFragment } from "storefrontapi.generated";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Badge } from "../ui/badge";

export function ProductImage({
  images,
}: {
  images: ProductFragment["images"]["edges"];
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(1);
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    setCurrent(1);
    setCount(images.length);
    if (api) {
      api.scrollTo(0);
    }
  }, [images, api]);

  const handleApiChange = useCallback((newApi: CarouselApi) => {
    setApi(newApi);

    if (newApi) {
      newApi.on("select", () => {
        setCurrent(newApi.selectedScrollSnap() + 1);
      });

      setCount(images.length);
      setCurrent(newApi.selectedScrollSnap() + 1);
    }
  }, []);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Carousel setApi={handleApiChange} className="size-fit basis-3/5 space-y-2">
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
      <div className="absolute top-0 flex w-full justify-between gap-2 rounded-lg px-2">
        <div className="space-x-2">
          <CarouselPrevious className="static transform-none" />
          <CarouselNext className="static transform-none" />
        </div>
        <Badge className="self-center border-border bg-background hover:bg-secondary">
          Imagen {current} de {count}
        </Badge>
      </div>
    </Carousel>
  );
}
