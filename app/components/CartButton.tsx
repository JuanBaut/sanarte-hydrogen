import { Await } from "@remix-run/react";
import { CartViewPayload, useAnalytics } from "@shopify/hydrogen";
import { ShoppingCart } from "lucide-react";
import { Suspense } from "react";
import { HeaderProps } from "./Header";
import { FakeButton } from "./ui/button";

export default function CartButton({ cart }: Pick<HeaderProps, "cart">) {
  const { publish, shop, cart: analyticsCart, prevCart } = useAnalytics();

  const handleAnalytics = () => {
    publish("cart_viewed", {
      cart: analyticsCart,
      prevCart,
      shop,
      url: window.location.href || "",
    } as CartViewPayload);
  };

  return (
    <FakeButton
      size={"icon"}
      variant={"icon"}
      className="flex w-fit gap-1 self-center px-2"
      aria-label="View cart"
      onClick={handleAnalytics}
    >
      <ShoppingCart />
      <Suspense fallback={<span>&nbsp;</span>}>
        <Await resolve={cart}>
          {(cart) => (
            <div className="flex size-[17px] justify-center rounded-full bg-secondary align-middle text-xs text-accent-foreground">
              <p className="self-center">{cart?.totalQuantity || 0}</p>
            </div>
          )}
        </Await>
      </Suspense>
    </FakeButton>
  );
}
