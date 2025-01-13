import CartButton from "./CartButton";
import { HeaderProps } from "./Header";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export default function CartAside({ cart }: Pick<HeaderProps, "cart">) {
  return (
    <Sheet>
      <SheetTrigger className="flex h-full">
        <CartButton cart={cart} />
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        this will be the cart content
      </SheetContent>
    </Sheet>
  );
}
