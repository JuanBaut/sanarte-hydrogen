import { Await } from "@remix-run/react";
import { Image, Money } from "@shopify/hydrogen";
import { Link } from "lucide-react";
import { Suspense } from "react";
import type { RecommendedProductsQuery } from "storefrontapi.generated";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="m-8 h-min space-y-4">
      <h2 className="font-playwrite text-2xl font-normal">
        Recommended Products
      </h2>
      <Suspense fallback={<div>Cargando...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="flex gap-4">
              {response
                ? response.products.nodes.map((product) => (
                    <Link key={product.id} to={`/products/${product.handle}`}>
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            <h4>{product.title}</h4>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Image
                            className="rounded"
                            data={product.images.nodes[0]}
                            aspectRatio="1/1"
                            sizes="(min-width: 45em) 20vw, 50vw"
                          />
                        </CardContent>
                        <CardFooter>
                          <small>
                            <Money data={product.priceRange.minVariantPrice} />
                          </small>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
