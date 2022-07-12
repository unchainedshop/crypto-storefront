import { useMutation, gql } from '@apollo/client';

import CartFragment from '../fragments/CartFragment';

const AddCartProductMutation = gql`
  mutation AddCartProduct($productId: ID!) {
    addCartProduct(productId: $productId) {
      _id
      total {
        gweiAmount
        currency
      }
      order {
        ...CartFragment
      }
    }
  }
  ${CartFragment}
`;

const useAddCartProduct = () => {
  const [addCartProductMutation] = useMutation(AddCartProductMutation, {
    refetchQueries: ['user', 'cart'],
  });

  const addCartProduct = async ({ productId }) => {
    await addCartProductMutation({ variables: { productId } });
  };

  return {
    addCartProduct,
  };
};

export default useAddCartProduct;
