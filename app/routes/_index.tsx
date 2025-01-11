import {
  Await,
  Link,
  useLoaderData,
  type MetaFunction,
} from "@remix-run/react";
import { Image, Money } from "@shopify/hydrogen";
import { defer, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { Suspense } from "react";
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from "storefrontapi.generated";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

export const meta: MetaFunction = () => {
  return [{ title: "SanArte | Home" }];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({ ...deferredData, ...criticalData });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context }: LoaderFunctionArgs) {
  const [{ collections }] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      {/*<FeaturedCollection collection={data.featuredCollection} />*/}
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="mx-auto h-min max-w-screen-xl space-y-4 px-16 py-4">
      <h2 className="font-playwrite text-2xl font-normal">
        Productos Recomendados
      </h2>

      <Carousel className="">
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
                          <Card className="aspect-square">
                            <CardContent className="overflow-hidden rounded-xl px-0">
                              <Image
                                className="object-cover"
                                data={product.images.nodes[0]}
                                aspectRatio="1/1"
                                sizes="(min-width: 45em) 20vw, 50vw"
                              />
                            </CardContent>
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
                          </Card>
                        </Link>
                      </CarouselItem>
                    ))
                  : null}
              </CarouselContent>
            )}
          </Await>
        </Suspense>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
