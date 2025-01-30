import { type FetcherWithComponents } from "@remix-run/react";
import { CartForm, type OptimisticCartLineInput } from "@shopify/hydrogen";
import { ShoppingCart } from "lucide-react";
import { ProductFragment, ProductQuery } from "storefrontapi.generated";
import { Button } from "../ui/button";

export function AddToCartButton({
  selectedVariant,
  //storeDomain,
  analytics,
  children,
  disabled,
  lines,
}: {
  disabled?: boolean;
  analytics?: unknown;
  onClick?: () => void;
  children: React.ReactNode;
  lines: Array<OptimisticCartLineInput>;
  storeDomain: ProductQuery["shop"]["primaryDomain"]["url"];
  selectedVariant: ProductFragment["selectedOrFirstAvailableVariant"];
}) {
  const array: string[] = [];

  if (selectedVariant?.id) {
    array.push(selectedVariant?.id);
  }

  return (
    <CartForm
      route="/cart"
      inputs={{ lines }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={disabled ?? fetcher.state !== "idle"}
              variant={"secondary"}
              className="w-full"
            >
              {children}
              <ShoppingCart />
            </Button>
            {/*{selectedVariant ? (*/}
            {/*  <ShopPayButton*/}
            {/*    width="100%"*/}
            {/*    variantIds={array}*/}
            {/*    storeDomain={storeDomain}*/}
            {/*  />*/}
            {/*) : null}*/}
          </div>
        </>
      )}
    </CartForm>
  );
}
