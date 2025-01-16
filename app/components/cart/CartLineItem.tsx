import { Link } from "@remix-run/react";
import { CartForm, Image, type OptimisticCartLine } from "@shopify/hydrogen";
import type { CartLineUpdateInput } from "@shopify/hydrogen/storefront-api-types";
import { Minus, Plus, Trash } from "lucide-react";
import type { CartApiQueryFragment } from "storefrontapi.generated";
import { useVariantUrl } from "~/lib/variants";
import { ProductPrice } from "../product/ProductPrice";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { SheetClose } from "../ui/sheet";

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({ line }: { line: CartLine }) {
  const { id, merchandise } = line;
  const { quantityAvailable, product, title, image, selectedOptions } =
    merchandise;
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

          <CartLineQuantity line={line} quantityAvailable={quantityAvailable} />
        </div>
      </div>
    </Card>
  );
}

function CartLineQuantity({
  line,
  quantityAvailable,
}: {
  line: CartLine;
  quantityAvailable: number;
}) {
  if (!line || typeof line?.quantity === "undefined") return null;
  const { id: lineId, quantity, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex justify-between">
      <div className="flex gap-2 rounded-md border border-border/30">
        <CartLineUpdateButton
          name="decrease-quantity"
          ariaLabel="Decrease quantity"
          value={prevQuantity}
          disabled={quantity <= 1 || !!isOptimistic}
          lines={[{ id: lineId, quantity: prevQuantity }]}
        >
          <Minus />
        </CartLineUpdateButton>
        <p className="self-center leading-none">{quantity}</p>
        <CartLineUpdateButton
          name="increase-quantity"
          ariaLabel="Increase quantity"
          value={nextQuantity}
          disabled={nextQuantity === quantityAvailable + 1 || !!isOptimistic}
          lines={[{ id: lineId, quantity: nextQuantity }]}
        >
          <Plus />
        </CartLineUpdateButton>
      </div>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

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
        className="size-7 [&_svg]:size-5"
        variant={"icon"}
        disabled={disabled}
        type="submit"
      >
        <Trash />
      </Button>
    </CartForm>
  );
}

interface CartLineUpdateProps {
  name: string;
  value: number;
  disabled: boolean;
  ariaLabel: string;
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}

function CartLineUpdateButton({
  ariaLabel,
  disabled,
  children,
  value,
  lines,
  name,
}: CartLineUpdateProps) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      <Button
        name={name}
        value={value}
        size={"icon"}
        variant={"icon"}
        disabled={disabled}
        aria-label={ariaLabel}
        className="size-7 self-center [&_svg]:size-5"
      >
        {children}
      </Button>
    </CartForm>
  );
}
