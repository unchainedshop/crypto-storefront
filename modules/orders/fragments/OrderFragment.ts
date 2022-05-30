import { gql } from '@apollo/client';

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
          amount
          currency
        }
      }
      status
      fee {
        amount
        currency
      }
    }
    orderNumber
    total {
      amount
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
        amount
        currency
      }
    }

    payment {
      _id
      status
      paid
      fee {
        amount
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
`;

export default OrderFragment;
