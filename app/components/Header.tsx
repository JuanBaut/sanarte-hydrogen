import { Await, NavLink } from "@remix-run/react";
import { Image } from "@shopify/hydrogen";
import { LogIn, Search, User } from "lucide-react";
import { Suspense } from "react";
import type {
  CartApiQueryFragment,
  HeaderQuery,
} from "storefrontapi.generated";
import logo from "~/assets/logo.png";
import CartAside from "./cart/CartAside";
import MobileAside from "./MobileAside";
import { Button } from "./ui/button";

export interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const { shop, menu } = header;
  return (
    <header className="fixed z-50 h-20 w-full border-b border-border/20 bg-background/50 px-4 py-2 backdrop-blur-md">
      <div className="grid w-full grid-cols-3 justify-items-center">
        <HeaderMenu
          menu={menu}
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />

        <div className="mx-1 h-full place-self-start sm:hidden">
          <MobileAside
            menu={menu}
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>

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

        <div className="col-start-3 mx-1 h-full place-self-end sm:hidden">
          <CartAside cart={cart} />
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
  publicStoreDomain: HeaderProps["publicStoreDomain"];
}) {
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
          <NavLink end key={item.id} prefetch="intent" to={url}>
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
      {/*this suspense thing should be in a separate component*/}
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
      <CartAside cart={cart} />
    </nav>
  );
}

function SearchToggle() {
  // functionality not implemented yet

  return (
    <Button variant={"icon"} size={"icon"}>
      <Search />
    </Button>
  );
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
