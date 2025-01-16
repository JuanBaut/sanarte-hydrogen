import { Link, useNavigate } from "@remix-run/react";
import { type MappedProductOptions } from "@shopify/hydrogen";
import type {
  Maybe,
  ProductOptionValueSwatch,
} from "@shopify/hydrogen/storefront-api-types";
import type { ProductFragment } from "storefrontapi.generated";
import { AddToCartButton } from "./AddToCartButton";
import { Badge } from "../ui/badge";

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment["selectedOrFirstAvailableVariant"];
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="w-full space-y-2" key={option.name}>
            <h4 className="text-sm leading-none">{option.name}</h4>
            <div className="flex gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch
                        selected={selectedVariant?.title}
                        swatch={swatch}
                        name={name}
                      />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch
                        selected={selectedVariant?.title}
                        swatch={swatch}
                        name={name}
                      />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? "Agregar al carrito" : "Agotado"}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  selected,
  swatch,
  name,
}: {
  selected: string | undefined;
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div className="flex flex-wrap">
      <Badge
        variant={"outline"}
        className={`gap-2 py-1 ${selected === name ? "" : "border-border/20"}`}
      >
        <div
          style={color ? { backgroundColor: color } : undefined}
          className="size-3 rounded-full"
          aria-label={name}
        >
          {!!image && <img src={image} alt={name} />}
        </div>

        <span className="text-center leading-3">{name}</span>
      </Badge>
    </div>
  );
}
