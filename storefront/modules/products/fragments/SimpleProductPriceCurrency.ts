import { gql } from '@apollo/client';

const SimpleProductPriceCurrency = gql`
  fragment SimpleProductPriceCurrency on SimpleProduct {
    simulatedPrice(currency: $currency) {
      _id
      isTaxable
      isNetPrice
      gweiAmount
      currency
    }
  }
`;

export default SimpleProductPriceCurrency;
