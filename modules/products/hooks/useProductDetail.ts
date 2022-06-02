import { useQuery, gql } from '@apollo/client';
import { useIntl } from 'react-intl';

import useCurrencyContext from '../../common/utils/useCurrencyContext';
import ProductFragment from '../fragments/ProductFragment';
import ProductReviewsFragment from '../fragments/ProductReviewsFragment';

const ProductDetailQuery = gql`
  query ProductDetailQuery(
    $slug: String
    $forceLocale: String
    $currency: String
  ) {
    product(slug: $slug) {
      ...ProductFragment
      reviews {
        ...ProductReviewsFragment
      }
    }
  }
  ${ProductFragment}
  ${ProductReviewsFragment}
`;

const useProductDetail = ({ slug }) => {
  const intl = useIntl();
  const { selectedCurrency } = useCurrencyContext();
  const { data, loading, error } = useQuery(ProductDetailQuery, {
    skip: !slug,
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
