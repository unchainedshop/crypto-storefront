import { gql } from '@apollo/client';

import AddressFragment from '../../common/fragments/AddressFragment';
import ProductFragment from '../../products/fragments/ProductFragment';

const CurrentUserFragment = gql`
  fragment CurrentUserFragment on User {
    _id
    isGuest
    name
    username
    emails {
      address
      verified
    }
    roles
    orders {
      _id
    }
    isInitialPassword
    lastLogin {
      timestamp
      countryCode
      locale
    }
    bookmarks {
      _id
      created
      product {
        ...ProductFragment
      }
    }

    profile {
      phoneMobile
      address {
        ...AddressFragment
      }
    }
    cart {
      _id
      billingAddress {
        ...AddressFragment
      }
      currency {
        _id
        isoCode
      }

      contact {
        telNumber
        emailAddress
      }
      itemsTotal: total(category: ITEMS) {
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
          ...ProductFragment
        }
      }
      paymentInfo: payment {
        _id
        status
        provider {
          _id
          type
          interface {
            _id
            label
            version
          }
        }
        ... on OrderPaymentGeneric {
          _id
        }
      }
      taxes: total(category: TAXES) {
        gweiAmount
        currency
      }
      delivery: total(category: DELIVERY) {
        gweiAmount
        currency
      }
      payment: total(category: PAYMENT) {
        gweiAmount
        currency
      }
      deliveryInfo: delivery {
        _id
        provider {
          _id
        }
        ... on OrderDeliveryShipping {
          address {
            ...AddressFragment
          }
        }
      }
      total {
        gweiAmount
        currency
      }
      currency {
        _id
        isoCode
      }
      supportedPaymentProviders {
        _id
        type
        interface {
          _id
          label
          version
        }
      }
      supportedDeliveryProviders {
        _id
        type
        interface {
          _id
          label
          version
        }
        simulatedPrice(currency: $currency) {
          _id
          gweiAmount
          currency
        }
      }
    }
  }
  ${ProductFragment}
  ${AddressFragment}
`;

export default CurrentUserFragment;
