import logo from "~/assets/logo.png";
import { Suspense } from "react";
import { Await, NavLink, useAsyncValue } from "@remix-run/react";
import {
  type CartViewPayload,
  Image,
  useAnalytics,
  useOptimisticCart,
} from "@shopify/hydrogen";
import type {
  HeaderQuery,
  CartApiQueryFragment,
} from "storefrontapi.generated";
import { useAside } from "~/components/Aside";
import MobileMenu from "./mobile-menu";
import { Button } from "./ui/button";
import { LogIn, Search, ShoppingCart, User } from "lucide-react";

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = "desktop" | "mobile";

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const { shop, menu } = header;
  return (
    <header className="fixed z-50 h-20 w-full border-b bg-background/50 px-4 py-2 backdrop-blur-md">
      <div className="grid w-full grid-cols-3 justify-items-center">
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />

        <NavLink className="self-center" prefetch="intent" to="/">
          <div className="mx-auto w-fit">
            <Image
              sizes="40vw, 100vw"
              className="h-16"
              loading="eager"
              src={logo}
              alt={shop.name}
            />
          </div>
        </NavLink>

        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />

        <div className="col-start-3 mx-2 h-full place-self-end">
          <MobileMenu
            menu={menu}
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderProps["header"]["menu"];
  primaryDomainUrl: HeaderProps["header"]["shop"]["primaryDomain"]["url"];
  viewport: Viewport;
  publicStoreDomain: HeaderProps["publicStoreDomain"];
}) {
  const { close } = useAside();

  return (
    <nav className="hidden gap-4 self-center sm:flex" role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes("myshopify.com") ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink end key={item.id} onClick={close} prefetch="intent" to={url}>
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, "isLoggedIn" | "cart">) {
  return (
    <nav className="hidden gap-4 self-center sm:flex" role="navigation">
      <NavLink prefetch="intent" to="/account">
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) =>
              isLoggedIn ? (
                <Button variant={"icon"} size={"icon"}>
                  <User />
                </Button>
              ) : (
                <Button variant={"icon"} size={"icon"}>
                  <LogIn />
                </Button>
              )
            }
          </Await>
        </Suspense>
      </NavLink>

      <SearchToggle />

      <CartToggle cart={cart} />
    </nav>
  );
}

function SearchToggle() {
  const { open } = useAside();
  return (
    <Button variant={"icon"} size={"icon"} onClick={() => open("search")}>
      <Search />
    </Button>
  );
}

function CartBadge({ count }: { count: number | null }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open("cart");
        publish("cart_viewed", {
          cart,
          prevCart,
          shop,
          url: window.location.href || "",
        } as CartViewPayload);
      }}
    >
      <ShoppingCart /> {count === null ? <span>&nbsp;</span> : count}
    </a>
  );
}

function CartToggle({ cart }: Pick<HeaderProps, "cart">) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

export const FALLBACK_HEADER_MENU = {
  id: "gid://shopify/Menu/199655587896",
  items: [
    {
      id: "gid://shopify/MenuItem/461609500728",
      resourceId: null,
      tags: [],
      title: "Collections",
      type: "HTTP",
      url: "/collections",
      items: [],
    },
    {
      id: "gid://shopify/MenuItem/461609533496",
      resourceId: null,
      tags: [],
      title: "Blog",
      type: "HTTP",
      url: "/blogs/journal",
      items: [],
    },
    {
      id: "gid://shopify/MenuItem/461609566264",
      resourceId: null,
      tags: [],
      title: "Policies",
      type: "HTTP",
      url: "/policies",
      items: [],
    },
    {
      id: "gid://shopify/MenuItem/461609599032",
      resourceId: "gid://shopify/Page/92591030328",
      tags: [],
      title: "About",
      type: "PAGE",
      url: "/pages/about",
      items: [],
    },
  ],
};
