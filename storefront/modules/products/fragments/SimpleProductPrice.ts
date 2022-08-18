import { gql } from '@apollo/client';

const SimpleProductPrice = gql`
  fragment SimpleProductPrice on SimpleProduct {
    simulatedPrice {
      _id
      isTaxable
      isNetPrice
      gweiAmount
      currency
    }
  }
`;

export default SimpleProductPrice;
