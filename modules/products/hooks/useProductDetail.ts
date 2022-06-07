import { useQuery, gql } from '@apollo/client';
import { useIntl } from 'react-intl';
import { ProductAssortmentPathFragment } from '../../assortment/fragments/AssortmentPath';
import { useAppContext } from '../../common/components/AppContextWrapper';

import ProductFragment from '../fragments/ProductFragment';
import ProductReviewsFragment from '../fragments/ProductReviewsFragment';

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
      reviews {
        ...ProductReviewsFragment
      }
    }
  }
  ${ProductFragment}
  ${ProductAssortmentPathFragment}
  ${ProductReviewsFragment}
`;

const useProductDetail = ({ slug }) => {
  const intl = useIntl();
  const { selectedCurrency } = useAppContext();
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
