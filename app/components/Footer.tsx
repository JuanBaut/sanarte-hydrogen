import {Await, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {Button} from './ui/button';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <footer className="border-t bg-primary/50 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl mb-4 font-playwrite">Sobre Nosotros</h3>
              <p className="">
                SanArte es tu destino para productos seleccionados de alta
                calidad que aportan elegancia a tu vida cotidiana.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-4 font-playwrite">Más enlaces</h3>
              <ul className="space-y-2">
                <li>Products</li>
                <li>About</li>
                <li>Contact</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 font-playwrite">Boletín</h3>
              <p className="mb-4">
                Suscríbete a nuestro boletín para recibir las últimas novedades
                y ofertas exclusivas.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-2 w-[20px] h-[40px] rounded-l-md border"
                />
                <Button type="submit" className="rounded-l-none h-[40px]">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <p className="">&copy; 2025 SanArte. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/*<Await resolve={footerPromise}>*/}
      {/*  {(footer) => (*/}
      {/*    <footer className="footer">*/}
      {/*      {footer?.menu && header.shop.primaryDomain?.url && (*/}
      {/*        <FooterMenu*/}
      {/*          menu={footer.menu}*/}
      {/*          primaryDomainUrl={header.shop.primaryDomain.url}*/}
      {/*          publicStoreDomain={publicStoreDomain}*/}
      {/*        />*/}
      {/*      )}*/}
      {/*    </footer>*/}
      {/*  )}*/}
      {/*</Await>*/}
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink end key={item.id} prefetch="intent" to={url}>
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
