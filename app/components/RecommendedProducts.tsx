import { Await, Link } from "@remix-run/react";
import { Image, Money } from "@shopify/hydrogen";
import { Suspense } from "react";
import { RecommendedProductsQuery } from "storefrontapi.generated";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <Carousel className="mx-auto h-min max-w-screen-xl space-y-4 px-8 py-4">
      <div className="flex w-full justify-between gap-2 rounded-lg">
        <div className="flex flex-wrap gap-2 font-playwrite text-2xl font-normal">
          <span>Productos</span>
          <span>Recomendados</span>
        </div>
        <div className="flex items-center space-x-2">
          <CarouselPrevious className="static transform-none" />
          <CarouselNext className="static transform-none" />
        </div>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <Await resolve={products}>
          {(response) => (
            <CarouselContent>
              {response
                ? response.products.nodes.map((product) => (
                    <CarouselItem
                      key={product.id}
                      className="aspect-square max-w-[340px] sm:basis-1/2 md:basis-1/3 xl:basis-1/4"
                    >
                      <Link to={`/products/${product.handle}`}>
                        <Card>
                          <CardContent className="space-y-4 p-0">
                            <Image
                              className="object-cover"
                              data={product.images.nodes[0]}
                              aspectRatio="1/1"
                              sizes="(min-width: 45em) 20vw, 50vw"
                            />
                            <CardFooter className="flex flex-col items-start">
                              <CardTitle>
                                <h4>{product.title}</h4>
                              </CardTitle>
                              <small>
                                <Money
                                  data={product.priceRange.minVariantPrice}
                                />
                              </small>
                            </CardFooter>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))
                : null}
            </CarouselContent>
          )}
        </Await>
      </Suspense>
    </Carousel>
  );
}
