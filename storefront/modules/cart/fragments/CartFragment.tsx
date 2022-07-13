import { gql } from '@apollo/client';

import AddressFragment from '../../common/fragments/AddressFragment';

const CartFragment = gql`
  fragment CartFragment on Order {
    _id
    status
    user {
      _id
      cart {
        _id
      }
    }
    total(category: ITEMS) {
      gweiAmount
      currency
    }
    deliveryTotal: total(category: DELIVERY) {
      gweiAmount
      currency
    }
    paymentTotal: total(category: PAYMENT) {
      gweiAmount
      currency
    }
    taxesTotal: total(category: TAXES) {
      gweiAmount
      currency
    }
    items {
      _id
      quantity
      total {
        gweiAmount
        currency
      }
      product {
        _id
        texts {
          _id
          title
        }
      }
    }
    billingAddress {
      ...AddressFragment
    }
    delivery {
      _id
      provider {
        _id
        type
      }
      ... on OrderDeliveryShipping {
        address {
          ...AddressFragment
        }
      }
    }
  }
  ${AddressFragment}
`;

export default CartFragment;
