import { useNavigate } from "@remix-run/react";
import { useOptimisticCart } from "@shopify/hydrogen";
import { ArrowRight } from "lucide-react";
import type { CartApiQueryFragment } from "storefrontapi.generated";
import { CartLineItem } from "~/components/cart/CartLineItem";
import { FakeButton } from "../ui/button";
import { SheetClose } from "../ui/sheet";
import { CartSummary } from "./CartSummary";

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({ cart: originalCart }: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity! > 0;

  //const withDiscount =
  //  cart &&
  //  Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  //const className = `cart-main ${withDiscount ? "with-discount" : ""}`;

  return (
    <>
      <CartEmpty hidden={linesCount} />
      <div className="flex h-full max-h-full flex-col justify-between gap-2">
        <div
          className="flex flex-grow-0 flex-col gap-2 overflow-auto"
          aria-labelledby="cart-lines"
        >
          {(cart?.lines?.nodes ?? []).map((line) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </div>
        {cartHasItems && <CartSummary cart={cart} />}
      </div>
    </>
  );
}

function CartEmpty({ hidden = false }: { hidden: boolean }) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/collections/all");
  };

  return (
    <div hidden={hidden}>
      <div className="grid grid-rows-2 place-items-center pt-8">
        <p className="w-fit">¡Parece que aún no has agregado nada!</p>

        <SheetClose onClick={handleClose}>
          <FakeButton variant={"ghost"}>
            Seguir comprando <ArrowRight />
          </FakeButton>
        </SheetClose>
      </div>
    </div>
  );
}
