import { gql } from '@apollo/client';
import AddressFragment from '../../common/fragments/AddressFragment';

const OrderFragment = gql`
  fragment OrderFragment on Order {
    _id
    status
    created
    updated
    ordered
    country {
      flagEmoji
      name
    }
    billingAddress {
      ...AddressFragment
    }
    delivery {
      _id
      provider {
        _id
        type
        interface {
          _id
          label
          version
        }
        simulatedPrice(currency: $currency) {
          gweiAmount
          currency
        }
      }
      status
      fee {
        gweiAmount
        currency
      }
      ... on OrderDeliveryShipping {
        address {
          ...AddressFragment
        }
      }
    }
    orderNumber
    total {
      isTaxable
      gweiAmount
      currency
    }
    supportedPaymentProviders {
      _id
      type
    }
    supportedDeliveryProviders {
      _id
      type
      simulatedPrice(currency: $currency) {
        gweiAmount
        currency
      }
    }

    payment {
      _id
      status
      paid
      fee {
        gweiAmount
        currency
      }
      provider {
        _id
        type
        interface {
          _id
          label
          version
        }
      }
    }
  }
  ${AddressFragment}
`;

export default OrderFragment;
