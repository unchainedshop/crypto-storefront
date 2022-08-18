import { useQuery, gql } from '@apollo/client';
import { useIntl } from 'react-intl';
import { ProductAssortmentPathFragment } from '../../assortment/fragments/AssortmentPath';
import { useAppContext } from '../../common/components/AppContextWrapper';

import ProductFragment from '../fragments/ProductFragment';
import ProductReviewsFragment from '../fragments/ProductReviewsFragment';
import SimpleProductPrice from '../fragments/SimpleProductPrice';

const ProductDetailQuery = gql`
  query Product($slug: String, $forceLocale: String) {
    product(slug: $slug) {
      assortmentPaths {
        ...ProductAssortmentPathFragment
      }
      ...ProductFragment
      ...SimpleProductPrice
      reviews {
        ...ProductReviewsFragment
      }
    }
  }
  ${ProductFragment}
  ${ProductAssortmentPathFragment}
  ${ProductReviewsFragment}
  ${SimpleProductPrice}
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
