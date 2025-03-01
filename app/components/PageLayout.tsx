import { Link } from "@remix-run/react";
import { useId } from "react";
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from "storefrontapi.generated";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from "~/components/SearchFormPredictive";
import { SearchResultsPredictive } from "~/components/SearchResultsPredictive";

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <div>
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main className="pt-20">{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </div>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <div className="predictive-search">
      <br />
      <SearchFormPredictive>
        {({ fetchResults, goToSearch, inputRef }) => (
          <>
            <input
              name="q"
              onChange={fetchResults}
              onFocus={fetchResults}
              placeholder="Search"
              ref={inputRef}
              type="search"
              list={queriesDatalistId}
            />
            &nbsp;
            <button onClick={goToSearch}>Search</button>
          </>
        )}
      </SearchFormPredictive>

      <SearchResultsPredictive>
        {({ items, total, term, state, closeSearch }) => {
          const { articles, collections, pages, products, queries } = items;

          if (state === "loading" && term.current) {
            return <div>Cargando...</div>;
          }

          if (!total) {
            return <SearchResultsPredictive.Empty term={term} />;
          }

          return (
            <>
              <SearchResultsPredictive.Queries
                queries={queries}
                queriesDatalistId={queriesDatalistId}
              />
              <SearchResultsPredictive.Products
                products={products}
                closeSearch={closeSearch}
                term={term}
              />
              <SearchResultsPredictive.Collections
                collections={collections}
                closeSearch={closeSearch}
                term={term}
              />
              <SearchResultsPredictive.Pages
                pages={pages}
                closeSearch={closeSearch}
                term={term}
              />
              <SearchResultsPredictive.Articles
                articles={articles}
                closeSearch={closeSearch}
                term={term}
              />
              {term.current && total ? (
                <Link
                  onClick={closeSearch}
                  to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                >
                  <p>
                    View all results for <q>{term.current}</q>
                    &nbsp; →
                  </p>
                </Link>
              ) : null}
            </>
          );
        }}
      </SearchResultsPredictive>
    </div>
  );
}
