import { Await } from "@remix-run/react";
import { Suspense } from "react";
import CartButton from "./CartButton";
import { CartMain } from "./CartMain";
import { HeaderProps } from "./Header";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

export default function CartAside({ cart }: Pick<HeaderProps, "cart">) {
  return (
    <Sheet>
      <SheetTrigger className="flex h-full">
        <CartButton cart={cart} />
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl" side={"right"}>
        <SheetTitle className="pb-4">Carrito</SheetTitle>

        <Suspense>
          <Await resolve={cart}>{(cart) => <CartMain cart={cart} />}</Await>
        </Suspense>
      </SheetContent>
    </Sheet>
  );
}
