import {NavLink} from '@remix-run/react';
import {Menu} from 'lucide-react';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import {FALLBACK_HEADER_MENU} from './Header';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

interface props {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  publicStoreDomain: string;
}

export default function MobileMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: props['header']['menu'];
  primaryDomainUrl: props['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: props['publicStoreDomain'];
}) {
  return (
    <div className="sm:hidden">
      <Sheet>
        <SheetTrigger className="h-full">
          <Menu className="size-8 h-min my-auto text-primary-foreground" />
        </SheetTrigger>
        <SheetContent side={'right'}>
          <SheetHeader>
            <SheetTitle>SanArte</SheetTitle>
            <SheetDescription>
              La boutique que decora con alma.
            </SheetDescription>
          </SheetHeader>

          <div role="navigation" className="flex flex-col space-y-4 pt-4">
            {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
              if (!item.url) return null;

              // if the url is internal, we strip the domain
              const url =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) ||
                item.url.includes(primaryDomainUrl)
                  ? new URL(item.url).pathname
                  : item.url;
              return (
                <NavLink end key={item.id} prefetch="intent" to={url}>
                  <SheetClose className="text-2xl">{item.title}</SheetClose>
                </NavLink>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
