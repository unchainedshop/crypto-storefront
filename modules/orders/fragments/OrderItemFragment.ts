import { gql } from '@apollo/client';

const OrderItemFragment = gql`
  fragment OrderItemFragment on OrderItem {
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
      amount
      currency
    }
    discounts {
      orderDiscount {
        total {
          amount
          currency
        }
        code
      }
      total {
        amount
        currency
      }
    }
    total {
      amount
      currency
    }
  }
`;

export default OrderItemFragment;
