import { useIntl } from 'react-intl';

import { useRouter } from 'next/router';
import LoadingItem from '../../modules/common/components/LoadingItem';
import MetaTags from '../../modules/common/components/MetaTags';
import Footer from '../../modules/layout/components/Footer';
import Header from '../../modules/layout/components/Header';
import OrderList from '../../modules/orders/components/OrderList';
import useOrderList from '../../modules/orders/hooks/useUserOrderList';
import useRedirect from '../../modules/auth/hooks/useRedirect';

const Order = () => {
  const { orders, loading } = useOrderList();
  const { query, push } = useRouter();
  const { formatMessage } = useIntl();
  useRedirect({ to: '/login', matchGuests: true, matchAnonymous: true });

  const { queryString, ...restQuery } = query;
  const setQueryString = (searchString) => {
    if (searchString)
      push({
        query: {
          ...restQuery,
          queryString: searchString,
        },
      });
    else
      push({
        query: {
          ...restQuery,
        },
      });
  };

  return (
    <>
      <MetaTags title={formatMessage({ id: 'my_orders' })} />
      <Header />
      {loading ? (
        <LoadingItem />
      ) : (
        <OrderList
          orders={orders}
          queryString={queryString}
          setQueryString={setQueryString}
        />
      )}
      <Footer />
    </>
  );
};

export default Order;
