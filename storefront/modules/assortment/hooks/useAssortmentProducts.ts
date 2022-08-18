import { useQuery, gql } from '@apollo/client';
import { useIntl } from 'react-intl';
import { useAppContext } from '../../common/components/AppContextWrapper';

import ProductFragment from '../../products/fragments/ProductFragment';
import SimpleProductPrice from '../../products/fragments/SimpleProductPrice';
import AssortmentFragment from '../fragments/assortment';
import AssortmentMediaFragment from '../fragments/AssortmentMedia';
import AssortmentPathFragment from '../fragments/AssortmentPath';

export const AssortmentsProductsQuery = gql`
  query AssortmentsProductsQuery(
    $slugs: String!
    $forceLocale: String
    $offset: Int
    $limit: Int
  ) {
    assortment(slug: $slugs) {
      ...AssortmentFragment
      assortmentPaths {
        ...AssortmentPathFragment
      }
      media {
        ...AssortmentMediaFragment
      }
      searchProducts {
        filteredProductsCount
        productsCount
        products(offset: $offset, limit: $limit) {
          ...ProductFragment
          ...SimpleProductPrice
        }
      }
      productAssignments {
        product {
          ...ProductFragment
          ...SimpleProductPrice
        }
      }
    }
  }
  ${AssortmentFragment}
  ${ProductFragment}
  ${AssortmentPathFragment}
  ${AssortmentMediaFragment}
  ${SimpleProductPrice}
`;

const useAssortmentProducts = (
  {
    includeLeaves,
    slugs,
  }: { includeLeaves: boolean; slugs: string[] | string } = {
    includeLeaves: true,
    slugs: [],
  },
) => {
  const intl = useIntl();

  const { data, loading, error, fetchMore } = useQuery(
    AssortmentsProductsQuery,
    {
      variables: {
        includeLeaves,
        slugs,
        forceLocale: intl.locale,
        offset: 0,
        limit: 10,
      },
    },
  );
  const paths = (data?.assortment?.assortmentPaths || []).flat().pop()?.links;
  const products = data?.assortment?.searchProducts.products || [];
  const loadMore = () => {
    fetchMore({
      variables: {
        offset: products.length,
      },
    });
  };

  return {
    loading,
    loadMore,
    error,
    filteredProducts: data?.assortment?.searchProducts.filteredProductsCount,
    assortment: data?.assortment || {},
    products,
    paths,
  };
};

export default useAssortmentProducts;
