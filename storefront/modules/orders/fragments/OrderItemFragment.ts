import { gql } from '@apollo/client';

const OrderItemFragment = gql`
  fragment OrderItemFragment on OrderItem {
    _id
    product {
      _id
      media {
        _id
        file {
          name
          url
        }
      }
      texts {
        _id
        title
        subtitle
        description
        vendor
        labels
        brand
        slug
      }
    }
    quantity
    unitPrice {
      gweiAmount
      currency
    }
    discounts {
      orderDiscount {
        total {
          gweiAmount
          currency
        }
        code
      }
      total {
        gweiAmount
        currency
      }
    }
    total {
      gweiAmount
      currency
    }
  }
`;

export default OrderItemFragment;
