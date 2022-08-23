import { useIntl } from 'react-intl';
import Link from 'next/link';
import { CheckCircleIcon, PaperClipIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import renderPrice from '../../common/utils/renderPrice';
import useFormatDateTime from '../../common/utils/useFormatDateTime';
import useUser from '../../auth/hooks/useUser';
import QRCodeComponent from '../../checkout/components/QRCodeComponent';
import useSignForCheckout from '../../checkout/hooks/useSignForCheckout';
import getMediaUrl from '../../common/utils/getMediaUrl';
import defaultNextImageLoader from '../../common/utils/getDefaultNextImageLoader';
import { useAppContext } from '../../common/components/AppContextWrapper';

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    ?.toUpperCase()
    ?.split('')
    ?.map((char) => 127397 + char?.charCodeAt());
  return String.fromCodePoint(...(codePoints || []));
}

const OrderDetailComponent = ({ order }) => {
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();
  const { signForCheckout } = useSignForCheckout();
  const [paymentAddresses, setPaymentAddress] = useState([]);
  const { hasSigner, payWithMetaMask } = useAppContext();

  const { user } = useUser();
  const signOrderPayment = async () => {
    if (order?.payment.provider?.type === 'GENERIC') {
      const response = await signForCheckout({
        orderPaymentId: order?.payment?._id,
      });

      return JSON.parse(response || '[]');
    }

    return [];
  };

  useEffect(() => {
    const updateContractAddress = async () => {
      const signedAddress = await signOrderPayment();
      setPaymentAddress(signedAddress);
    };
    updateContractAddress();
  }, [order?.payment?._id]);

  return (
    <div className="bg-slate-50 dark:bg-slate-600">
      <div className="mx-auto max-w-full px-4 pt-16 sm:py-24 sm:px-6 lg:max-w-full lg:px-8">
        <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
          <div className="flex sm:items-baseline sm:space-x-4">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {formatMessage({
                id: 'order_num',
                defaultMessage: `Order #`,
              })}
              <span>{order?.orderNumber}</span>
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {formatMessage({
              id: 'order_placed',
              defaultMessage: 'Order placed',
            })}
            <time
              dateTime="2021-03-22"
              className="ml-2 font-medium text-slate-900 dark:text-slate-100"
            >
              {formatDateTime(order?.ordered)}
            </time>
          </p>
          <a
            href="#"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:hidden"
          >
            {formatMessage({
              id: 'invoice_mobile',
              defaultMessage: 'View invoice',
            })}
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>

        {/* Products */}
        <div className="mt-6">
          <h2 className="sr-only">
            {formatMessage({
              id: 'Products purchased',
              defaultMessage: 'products_purchased',
            })}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-8 border-slate-200 text-sm font-medium text-slate-500 md:grid-cols-2 lg:grid-cols-3">
            {order?.items?.map((item) => (
              <Link
                key={item._id}
                href={`/product/${item?.product?.texts?.slug}`}
              >
                <a className="flex w-full rounded-lg border border-t border-b border-slate-200 bg-white shadow-sm transition-transform hover:scale-105 hover:border-indigo-600 dark:bg-slate-600 dark:hover:border-sky-400 md:px-0">
                  <div className="flex w-full justify-between p-4">
                    <div className="flex">
                      <div className="relative h-40 w-40 overflow-hidden rounded-lg">
                        <Image
                          src={`${
                            getMediaUrl(item?.product) ||
                            '/static/img/sun-glass-placeholder.jpeg'
                          }`}
                          alt={item?.product?.texts?.title}
                          layout="fill"
                          objectFit="contain"
                          loader={defaultNextImageLoader}
                          className="h-full w-full flex-none rounded-md bg-slate-100 object-fill object-center dark:bg-slate-500"
                        />
                      </div>
                      <div className="ml-4 max-w-1/2">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                          {item?.product?.texts?.title}
                        </h3>
                        <p className="text-slate-400">
                          {item?.product?.texts?.subtitle}
                        </p>
                        <p className="text-slate-900 dark:text-slate-100">
                          {item?.product?.texts?.description}
                        </p>
                      </div>
                    </div>
                    <p className="text-right font-medium text-slate-900 dark:text-slate-100">
                      {renderPrice(item.total)}
                    </p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>

        {/* Delivery */}
        <div className="mt-16">
          <h2 className="sr-only">
            {formatMessage({
              id: 'delivery_summary',
              defaultMessage: 'Delivery Summary',
            })}
          </h2>

          <div className="bg-slate-100 py-6 px-4 dark:bg-slate-500 sm:rounded-lg sm:px-6 lg:flex lg:gap-x-8 lg:px-8 lg:py-8">
            <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:w-7/12 lg:flex-auto">
              <div>
                <dt className="text-base font-medium text-slate-900 dark:text-slate-100">
                  {formatMessage({
                    id: 'delivery_address',
                    defaultMessage: 'Delivery address',
                  })}
                </dt>
                <dd className="mt-3 text-slate-500 dark:text-slate-300">
                  <span className="block">
                    {user?.profile?.address?.firstName}&nbsp;
                    {user?.profile?.address?.lastName}
                  </span>
                  <span className="mb-2 block">
                    {user?.profile?.address?.addressLine}
                  </span>
                  <span className="mb-2 block">
                    {user?.profile?.address?.addressLine2}
                  </span>
                  <span className="mb-2 block">
                    {user?.profile?.address?.postalCode}
                  </span>
                  <span className="mb-2 block">
                    {user?.profile?.address?.city}&nbsp;&nbsp;
                    {getFlagEmoji(user?.profile?.address?.countryCode)}&nbsp;
                    {user?.profile?.address?.countryCode}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-lg font-medium text-slate-900 dark:text-white">
                  {formatMessage({
                    id: 'delivery_information',
                    defaultMessage: 'Delivery Information',
                  })}
                </dt>
                <dd className="-ml-4 -mt-1">
                  <div className="ml-4 mt-4">
                    <span className="block text-slate-500 dark:text-slate-300">
                      {order?.delivery?.provider?.interface?.label}&nbsp;&nbsp;
                      {order?.delivery?.provider?.interface?.version}
                    </span>
                  </div>
                  <div className="ml-4 mt-4">
                    <span className="text-slate-500 dark:text-slate-300">
                      {order?.delivery?.provider?.type}
                    </span>
                    <span className="mx-2 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                      {order?.delivery?.status}
                    </span>
                  </div>
                  <div className="ml-4 mt-4">
                    <span className="block text-slate-500 dark:text-slate-300">
                      {renderPrice(order?.delivery?.fee)}
                    </span>
                  </div>
                  <div className="ml-4 mt-4">
                    <p className="text-slate-600">
                      {order?.delivery?.delivered ? (
                        <>
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                          <span className="mx-2">
                            {formatMessage({
                              id: 'delivered_on',
                              defaultMessage: 'Delivered on',
                            })}
                          </span>
                          <time dateTime={order?.delivery?.delivered}>
                            {formatDateTime(order?.delivery?.delivered)}
                          </time>
                        </>
                      ) : null}
                    </p>
                  </div>
                </dd>
              </div>
            </dl>

            {order?.documents && (
              <dl className="mt-8 text-sm lg:col-span-5 lg:mt-0">
                <div className="flex items-center justify-between pb-4">
                  <dt className="font-medium text-slate-900 dark:text-slate-100">
                    {formatMessage({
                      id: 'document',
                      defaultMessage: 'Document',
                    })}
                  </dt>
                </div>
                <div>
                  <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                    <ul className="divide-y divide-slate-200 rounded-md border border-slate-200">
                      {order?.documents?.map((document) => (
                        <li
                          key={document._id}
                          className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                        >
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon
                              className="h-5 w-5 flex-shrink-0 text-slate-400"
                              aria-hidden="true"
                            />
                            <span className="ml-2 w-0 flex-1 truncate">
                              {document.name}
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <a
                              href={document.url}
                              className="font-medium text-blue-600 hover:text-blue-500 dark:text-fuchsia-500 dark:hover:text-fuchsia-600"
                            >
                              {formatMessage({
                                id: 'download',
                                defaultMessage: 'Download',
                              })}
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </div>

        {/* Billing */}
        <div className="mt-16">
          <h2 className="sr-only">
            {formatMessage({
              id: 'billing_summary',
              defaultMessage: 'Billing Summary',
            })}
          </h2>

          <div className="bg-slate-100 py-6 px-4 dark:bg-slate-600 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
            <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
              <div>
                <dt className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {formatMessage({
                    id: 'billing_address',
                    defaultMessage: 'Billing address',
                  })}
                </dt>
                <dd className="mt-3 text-slate-500 dark:text-slate-300">
                  <span className="block">
                    {order?.billingAddress?.firstName}&nbsp;
                    {order?.billingAddress?.lastName}
                  </span>
                  <span className="block">
                    {order?.billingAddress?.addressLine}
                  </span>
                  <span className="block">
                    {order?.billingAddress?.addressLine2}
                    {order?.billingAddress?.postalCode}&nbsp;
                  </span>
                  {order?.billingAddress?.countryCode && (
                    <span className="block">
                      {user?.profile?.address?.city}&nbsp;
                      {getFlagEmoji(order?.billingAddress?.countryCode)}&nbsp;
                      {order?.billingAddress?.countryCode}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {formatMessage({
                    id: 'payment_information',
                    defaultMessage: 'Payment information',
                  })}
                </dt>
                <div className="flex items-center gap-2">
                  {order?.status === 'PENDING' ? (
                    paymentAddresses.map((paymentAddress) => (
                      <div>
                        <div className="text-center text-lg font-bold text-slate-600 dark:text-slate-200">
                          {paymentAddress.currency}
                        </div>
                        <div className="mx-auto">
                          <div id="faq-0">
                            <QRCodeComponent
                              paymentAddress={paymentAddress}
                              currencyClassName="hidden"
                              className="mx-auto"
                            />
                          </div>
                          {hasSigner && (
                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                className="inline-flex items-center rounded-md border-2 border-[#F6851B] bg-[#F6851B] px-3 py-2 text-sm font-medium leading-4 text-slate-100 shadow hover:bg-[#E2761B] focus:outline-none focus:ring-2 focus:ring-[#F6851B] focus:ring-offset-2"
                                onClick={() =>
                                  payWithMetaMask(
                                    {
                                      orderId: order._id,
                                      orderAddress: paymentAddress.address,
                                    },
                                    user?.cart.total,
                                  )
                                }
                              >
                                {formatMessage({
                                  id: 'pay_with_metamask',
                                  defaultMessage: 'Pay with metamask',
                                })}
                                <span className="ml-2 rounded-full border border-[#CD6116] p-1">
                                  <img
                                    src="/static/img/icon-streamline/metamask-fox.svg"
                                    alt={formatMessage({
                                      id: 'metamask_fox',
                                      defaultMessage: 'Metamask Fox',
                                    })}
                                    className="h-5 w-5"
                                  />
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <dd className="-ml-4 -mt-1">
                      <div className="ml-4 mt-4">
                        <p className="sr-only">
                          {order?.payment?.provider?.interface?.label}
                        </p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p className="text-slate-500 dark:text-slate-300">
                          {order?.payment?.provider?.interface?.label}
                          &nbsp;&nbsp;
                          {order?.payment?.provider?.interface?.version}
                        </p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p className="text-slate-500 dark:text-slate-300">
                          <span>{order?.payment?.provider?.type}</span>
                          <span className="mx-2 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                            {order?.payment?.status}
                          </span>
                        </p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p className="text-slate-600 dark:text-slate-300">
                          {renderPrice(order?.payment?.fee)}
                        </p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p>
                          {order?.payment?.paid ? (
                            <>
                              <CheckCircleIcon
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                              />
                              <span className="mx-2">
                                {formatMessage({
                                  id: 'paid_on',
                                  defaultMessage: 'paid on',
                                })}
                              </span>
                              <time dateTime={order?.paid}>
                                {formatDateTime(order?.payment?.paid)}
                              </time>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </dd>
                  )}
                </div>
              </div>
            </dl>

            <dl className="mt-8 divide-y divide-slate-200 text-sm lg:col-span-5 lg:mt-0">
              <div className="flex items-center justify-between pb-4">
                <dt className="text-slate-600 dark:text-slate-300">
                  {formatMessage({
                    id: 'subtotal',
                    defaultMessage: 'Subtotal',
                  })}
                </dt>
                <dd className="font-medium text-slate-900 dark:text-sky-400">
                  {renderPrice(order?.total)}
                </dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-slate-600 dark:text-slate-300">
                  {formatMessage({
                    id: 'shipping',
                    defaultMessage: 'Shipping',
                  })}
                </dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">
                  {renderPrice(order?.delivery?.fee)}
                </dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-slate-600 dark:text-slate-300">
                  {formatMessage({ id: 'Tax', defaultMessage: 'Taxable' })}
                </dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">
                  {order?.total?.isTaxable ? 'Yes' : 'No'}
                </dd>
              </div>
              <div className="flex items-center justify-between pt-4">
                <dt className="font-medium text-slate-900 dark:text-slate-100">
                  {formatMessage({
                    id: 'order_total',
                    defaultMessage: 'Order total',
                  })}
                </dt>
                <dd className="font-medium text-indigo-600 dark:text-sky-400">
                  {renderPrice(order.total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailComponent;
