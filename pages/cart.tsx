import Link from 'next/link';
import { useIntl } from 'react-intl';
import useRedirect from '../modules/auth/hooks/useRedirect';
import useUser from '../modules/auth/hooks/useUser';
import ManageCart from '../modules/cart/components/ManageCart';
import LoadingItem from '../modules/common/components/LoadingItem';
import MetaTags from '../modules/common/components/MetaTags';

const Cart = () => {
  const { formatMessage } = useIntl();
  const { user, loading } = useUser();

  useRedirect({ to: '/checkout', matchUsers: true });

  return (
    <>
      <MetaTags title={formatMessage({ id: 'cart', defaultMessage: 'Cart' })} />
      <div className="-mr-4 -ml-4 flex flex-wrap">
        <div className="relative mx-auto w-full px-4 md:max-w-[66.666667%] md:flex-shrink-0 md:flex-grow-0 md:basis-2/3 lg:max-w-[50%] lg:flex-shrink-0 lg:flex-grow-0 lg:basis-1/2">
          <h1>{formatMessage({ id: 'cart', defaultMessage: 'Cart' })}</h1>
          {loading ? (
            <LoadingItem />
          ) : (
            <>
              <ManageCart user={user} />
              <div className="button-group mt-12">
                <Link href={{ pathname: '/review' }}>
                  <a className="button button--primary uppercase md:py-3.5 md:px-5">
                    {formatMessage({
                      id: 'checkout',
                      defaultMessage: 'Checkout',
                    })}
                  </a>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
