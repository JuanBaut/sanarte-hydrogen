import { type FetcherWithComponents } from "@remix-run/react";
import { CartForm, type OptimisticCartLineInput } from "@shopify/hydrogen";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
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

          <Button
            type="submit"
            disabled={disabled ?? fetcher.state !== "idle"}
            variant={"secondary"}
            className="w-full"
          >
            {children}
            <ShoppingCart />
          </Button>
        </>
      )}
    </CartForm>
  );
}
