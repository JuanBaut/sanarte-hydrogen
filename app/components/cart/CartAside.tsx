import { Await } from "@remix-run/react";
import { Suspense } from "react";
import type { HeaderProps } from "../Header";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartButton from "./CartButton";
import { CartMain } from "./CartMain";

export default function CartAside({ cart }: Pick<HeaderProps, "cart">) {
  return (
    <Sheet>
      <SheetTrigger className="flex h-full">
        <CartButton cart={cart} />
      </SheetTrigger>
      <SheetContent className="w-[90%] sm:max-w-xl" side={"right"}>
        <SheetDescription className="sr-only">
          Carrito de compras
        </SheetDescription>
        <SheetTitle className="pb-4">Carrito</SheetTitle>

        <Suspense>
          <Await resolve={cart}>{(cart) => <CartMain cart={cart} />}</Await>
        </Suspense>
      </SheetContent>
    </Sheet>
  );
}
