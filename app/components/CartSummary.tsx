import { FetcherWithComponents } from "@remix-run/react";
import { CartForm, Money, type OptimisticCart } from "@shopify/hydrogen";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { CartApiQueryFragment } from "storefrontapi.generated";
import { Button } from "./ui/button";

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
};

export function CartSummary({ cart }: CartSummaryProps) {
  return (
    <div
      className="mb-6 space-y-1 border-t py-4"
      aria-labelledby="cart-summary"
    >
      <dl className="flex justify-between text-lg font-medium sm:text-xl">
        <dt>Subtotal</dt>
        <dd>
          {cart.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost?.subtotalAmount} />
          ) : (
            "-"
          )}
        </dd>
      </dl>
      <span className="text-sm">
        Impuestos y envío calculados al finalizar la compra.
      </span>
      {/*<CartDiscounts discountCodes={cart.discountCodes} />*/}
      {/*<CartGiftCard giftCardCodes={cart.appliedGiftCards} />*/}
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
    </div>
  );
}
function CartCheckoutActions({ checkoutUrl }: { checkoutUrl?: string }) {
  if (!checkoutUrl) return null;

  return (
    <a href={checkoutUrl} target="_self" className="flex gap-2">
      <Button className="text-md mt-4 w-full" size="icon" variant={"secondary"}>
        Continuar con el pago
        <ChevronRight strokeWidth={2.25} />
      </Button>
    </a>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment["discountCodes"];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div>
              <code>{codes?.join(", ")}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment["appliedGiftCards"] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({ lastCharacters }) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ""); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = "";
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Applied Gift Card(s)</dt>
          <UpdateGiftCardForm>
            <div>
              <code>{codes?.join(", ")}</code>
              &nbsp;
              <button onSubmit={() => removeAppliedCode}>Remove</button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div>
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get("giftCardCode");
        if (code) saveAppliedCode && saveAppliedCode(code as string);
        return children;
      }}
    </CartForm>
  );
}
