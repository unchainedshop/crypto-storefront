import { useQuery, gql } from '@apollo/client';
import useCurrencyContext from '../../common/utils/useCurrencyContext';

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
  const { selectedCurrency } = useCurrencyContext();
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
