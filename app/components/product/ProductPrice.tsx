import { Money } from "@shopify/hydrogen";
import type { MoneyV2 } from "@shopify/hydrogen/storefront-api-types";

interface props {
  price?: MoneyV2;
  className?: string;
  compareAtPrice?: MoneyV2 | null;
}

export function ProductPrice({ price, className, compareAtPrice }: props) {
  return (
    <div className={`align-text-top ${className}`}>
      {compareAtPrice ? (
        <div>
          {price ? <Money data={price} /> : null}
          <s>
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
