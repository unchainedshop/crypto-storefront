import { useQuery, gql } from '@apollo/client';
import { useAppContext } from '../../common/components/AppContextWrapper';

import OrderFragment from '../fragments/OrderFragment';

const UserOrderListQuery = gql`
  query UserOrders($currency: String) {
    me {
      _id
      orders {
        ...OrderFragment
      }
    }
  }
  ${OrderFragment}
`;

const useOrderList = () => {
  const { selectedCurrency } = useAppContext();
  const { data, loading, error } = useQuery(UserOrderListQuery, {
    variables: {
      currency: selectedCurrency,
    },
  });

  return {
    orders: data?.me?.orders || [],
    loading,
    error,
  };
};

export default useOrderList;
