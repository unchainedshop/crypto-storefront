import { useQuery, gql } from '@apollo/client';
import { useAppContext } from '../../common/components/AppContextWrapper';

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
  const { selectedCurrency } = useAppContext();
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
