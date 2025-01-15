import { Link } from "@remix-run/react";
import { CartForm, Image, type OptimisticCartLine } from "@shopify/hydrogen";
import type { CartLineUpdateInput } from "@shopify/hydrogen/storefront-api-types";
import { Minus, Plus, Trash } from "lucide-react";
import type { CartApiQueryFragment } from "storefrontapi.generated";
import { useVariantUrl } from "~/lib/variants";
import { ProductPrice } from "../ProductPrice";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { SheetClose } from "../ui/sheet";

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({ line }: { line: CartLine }) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <Card
      key={id}
      className="flex flex-row gap-2 space-y-0 border-none py-2 shadow-none"
    >
      {image && (
        <Image
          className="size-24 rounded sm:size-40"
          aspectRatio="1/1"
          alt={title}
          data={image}
          loading="lazy"
          height={150}
          width={150}
        />
      )}

      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-wrap items-start justify-between gap-2 text-sm font-medium leading-none sm:text-lg">
          <Link className="font-medium" prefetch="intent" to={lineItemUrl}>
            <SheetClose>{product.title}</SheetClose>
          </Link>

          <ProductPrice price={line?.cost?.totalAmount} />
        </div>

        <div className="flex h-full flex-col justify-between leading-none">
          {selectedOptions.map((option) => (
            <div key={option.name}>
              <small>
                {option.name}: {option.value}
              </small>
            </div>
          ))}

          <CartLineQuantity line={line} />
        </div>
      </div>
    </Card>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({ line }: { line: CartLine }) {
  if (!line || typeof line?.quantity === "undefined") return null;
  const { id: lineId, quantity, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <Button
            size={"icon"}
            variant={"icon"}
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
          >
            <Minus />
          </Button>
        </CartLineUpdateButton>
        <p className="self-center">{quantity}</p>
        <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
          <Button
            size={"icon"}
            variant={"icon"}
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
          >
            <Plus />
          </Button>
        </CartLineUpdateButton>
      </div>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <Button
        size={"icon"}
        className="[&_svg]:size-5"
        variant={"icon"}
        disabled={disabled}
        type="submit"
      >
        <Trash />
      </Button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}
