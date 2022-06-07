import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';

import Link from 'next/link';
import Image from 'next/image';
import getConfig from 'next/config';
import useOrderDetail from '../modules/orders/hooks/useOrderDetail';
import MetaTags from '../modules/common/components/MetaTags';
import CartItem from '../modules/cart/components/CartItem';
import OrderPriceSummary from '../modules/checkout/components/OrderPriceSummary';
import useFormatDateTime from '../modules/common/utils/useFormatDateTime';
import defaultNextImageLoader from '../modules/common/utils/defaultNextImageLoader';

const {
  publicRuntimeConfig: { theme },
} = getConfig();

const ThankYou = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();

  if (!router.query.orderId) return '';
  const { order } = useOrderDetail({
    orderId: router.query?.orderId,
  });

  return (
    <>
      <MetaTags
        title={formatMessage({
          id: 'thank_you',
          defaultMessage: 'Thank you!',
        })}
        description={formatMessage({
          id: 'thank_you_description',
          defaultMessage:
            'It has reached us and an email with the order placement  confirmation is on its way. To avoid any potential  miscommunication, please check your spam, perhaps the email landed  there.',
        })}
      />

      {order && (
        <>
          <main className="relative lg:min-h-full">
            <div className="hidden  overflow-hidden lg:absolute lg:block lg:h-1/4 lg:w-1/2 lg:pr-4 xl:pr-12">
              <Image
                src={theme.assets.logo}
                alt={formatMessage({
                  id: 'shop_logo',
                  defaultMessage: 'Shop logo',
                })}
                layout="fill"
                placeholder="blur"
                blurDataURL="/placeholder.png"
                className="w-full rounded"
                loader={defaultNextImageLoader}
              />
            </div>

            <div>
              <div className="mx-auto max-w-2xl py-16 px-4 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
                <div className="lg:col-start-2">
                  <h1 className="text-sm font-medium text-indigo-600">
                    {formatMessage({
                      id: 'thank_you',
                      defaultMessage: 'Thank you!',
                    })}
                  </h1>
                  <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    {formatMessage({
                      id: 'thank_you_header',
                      defaultMessage:
                        'Thank You for Placing this Order with Us!',
                    })}
                  </p>
                  <p className="mt-2 text-base text-gray-500">
                    {formatMessage({
                      id: 'thank_you_description',
                      defaultMessage:
                        'It has reached us and an email with the order placement  confirmation is on its way. To avoid any potential  miscommunication, please check your spam, perhaps the email landed  there.',
                    })}
                  </p>

                  <FormattedMessage
                    tagName="dl"
                    id="thank_you_order_number"
                    defaultMessage="<dl> <dt> Your Order Number is: </dt> <dd>
                            {orderNumber}
                          </dd> </dl> "
                    values={{
                      dl: (chunks) => (
                        <dl className="mt-16 text-sm font-medium">{chunks}</dl>
                      ),
                      dt: (chunks) => (
                        <dt className="text-gray-900"> {chunks}</dt>
                      ),
                      dd: (chunks) => (
                        <dd className="mt-2 text-indigo-600">{chunks}</dd>
                      ),
                      orderNumber: order.orderNumber,
                    }}
                  />
                  <FormattedMessage
                    tagName="dl"
                    id="thank_you_order_date"
                    defaultMessage="<dl> <dt> The Date you placed the order is: </dt> <dd>
                          {orderDate}
                          </dd> </dl> "
                    values={{
                      dl: (chunks) => (
                        <dl className="mt-16 text-sm font-medium">{chunks}</dl>
                      ),
                      dt: (chunks) => (
                        <dt className="text-gray-900"> {chunks}</dt>
                      ),
                      dd: (chunks) => (
                        <dd className="mt-2 text-indigo-600">{chunks}</dd>
                      ),
                      orderDate: formatDateTime(order.created),
                    }}
                  />

                  {(order?.items || []).map((item) => (
                    <CartItem key={item._id} {...item} enableUpdate={false} />
                  ))}

                  <OrderPriceSummary order={order} />

                  <dl className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
                    <div>
                      <dt className="font-medium text-gray-900">
                        Shipping Address
                      </dt>
                      <dd className="mt-2">
                        <address className="not-italic">
                          <span className="block">Kristin Watson</span>
                          <span className="block">7363 Cynthia Pass</span>
                          <span className="block">Toronto, ON N3Y 4H8</span>
                        </address>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900">
                        Payment Information
                      </dt>
                      <dd className="mt-2 space-y-2 sm:flex sm:space-y-0 sm:space-x-4">
                        <div className="flex-none">
                          <svg
                            aria-hidden="true"
                            width="36"
                            height="24"
                            viewBox="0 0 36 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-auto"
                          >
                            <rect
                              width="36"
                              height="24"
                              rx="4"
                              fill="#224DBA"
                            />
                            <path
                              d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                              fill="#fff"
                            />
                          </svg>
                          <p className="sr-only">Visa</p>
                        </div>
                        <div className="flex-auto">
                          <p className="text-gray-900">Ending with 4242</p>
                          <p>Expires 12 / 21</p>
                        </div>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-16 border-t border-gray-200 py-6 text-right">
                    <Link href="/shop">
                      <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        {formatMessage({
                          id: 'continue_shopping',
                          defaultMessage: 'Continue Shopping',
                        })}

                        <span aria-hidden="true"> &rarr;</span>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default ThankYou;
