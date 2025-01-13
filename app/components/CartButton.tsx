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
      className="flex w-fit px-2"
      aria-label="View cart"
      onClick={handleAnalytics}
    >
      <ShoppingCart />
      <Suspense fallback={<span>&nbsp;</span>}>
        <Await resolve={cart}>{(cart) => cart?.totalQuantity || 0}</Await>
      </Suspense>
    </FakeButton>
  );
}
