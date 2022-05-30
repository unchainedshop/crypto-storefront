import { useQuery, gql } from '@apollo/client';
import useCurrencyContext from '../../common/utils/useCurrencyContext';

import OrderFragment from '../fragments/OrderFragment';
import OrderItemFragment from '../fragments/OrderItemFragment';

const OrderDetailQuery = gql`
  query OrderDetailQuery($orderId: ID!, $currency: String) {
    order(orderId: $orderId) {
      ...OrderFragment
      items {
        ...OrderItemFragment
      }
    }
  }
  ${OrderFragment}
  ${OrderItemFragment}
`;

const useOrderDetail = ({ orderId }) => {
  const { selectedCurrency } = useCurrencyContext();
  const { data, loading, error, ...rest } = useQuery(OrderDetailQuery, {
    variables: { orderId, currency: selectedCurrency },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    ssr: false,
    skip: !orderId,
  });

  return {
    order: data?.order,
    loading,
    error,
    ...rest,
  };
};

export default useOrderDetail;
