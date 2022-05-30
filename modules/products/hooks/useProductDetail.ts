import { useQuery, gql } from '@apollo/client';
import { useIntl } from 'react-intl';

import { ProductAssortmentPathFragment } from '../../assortment/fragments/AssortmentPath';
import useCurrencyContext from '../../common/utils/useCurrencyContext';
import ProductFragment from '../fragments/ProductFragment';

const ProductDetailQuery = gql`
  query ProductDetailQuery(
    $slug: String
    $forceLocale: String
    $currency: String
  ) {
    product(slug: $slug) {
      assortmentPaths {
        ...ProductAssortmentPathFragment
      }
      ...ProductFragment
    }
  }
  ${ProductFragment}
  ${ProductAssortmentPathFragment}
`;

const useProductDetail = ({ slug }) => {
  const intl = useIntl();
  const { selectedCurrency } = useCurrencyContext();
  const { data, loading, error } = useQuery(ProductDetailQuery, {
    variables: { slug, forceLocale: intl.locale, currency: selectedCurrency },
  });

  const paths = (data?.product?.assortmentPaths || []).flat().pop()?.links;

  return {
    product: data?.product,
    paths,
    loading,
    error,
  };
};

export default useProductDetail;
