import { useIntl } from 'react-intl';

import Link from 'next/link';
import { PaperClipIcon } from '@heroicons/react/solid';
import renderPrice from '../../common/utils/renderPrice';
import useFormatDateTime from '../../common/utils/useFormatDateTime';

import useUser from '../../auth/hooks/useUser';

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

  const { user } = useUser();

  return (
    <div className="bg-slate-50 dark:bg-slate-600">
      <div className="mx-auto max-w-full pt-16 sm:py-24 sm:px-6 lg:max-w-full lg:px-8">
        <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
          <div className="flex sm:items-baseline sm:space-x-4">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {formatMessage({
                id: 'order_num',
                defaultMessage: `Order #`,
              })}
              <span>{order?.orderNumber}</span>
            </h1>
            <Link href="#">
              <a className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-sky-500 dark:hover:text-sky-400 sm:block">
                {formatMessage({
                  id: 'invoice',
                  defaultMessage: 'View invoice',
                })}
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </Link>
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

          <div className="mt-6 flex w-full gap-8 divide-y divide-slate-200 border border-slate-200 p-6 text-sm font-medium text-slate-500 sm:flex sm:flex-wrap sm:rounded-lg">
            {order?.items?.map((item) => (
              <div
                key={item._id}
                className="flex flex-auto space-x-6 border-t border-b border-slate-200 bg-white shadow-sm dark:bg-slate-600 dark:shadow-slate-100 sm:rounded-lg sm:border"
              >
                <div className="flex-auto p-4 lg:flex">
                  <div className="sm:flex lg:w-5/6">
                    <div className="w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-40">
                      <img
                        src={item?.product?.media?.file?.url}
                        alt={item?.product?.texts?.title}
                        className="h-full w-full flex-none rounded-md bg-slate-100 object-fill object-center dark:bg-slate-500"
                      />
                    </div>

                    <div className="ml-4 flex-auto">
                      <h3 className="text-slate-900 dark:text-slate-100">
                        <Link href={`/product/${item?.product?.texts?.slug}`}>
                          <a>{item?.product?.texts?.title}</a>
                        </Link>
                      </h3>
                      <p>{item?.product?.texts?.subtitle}</p>
                      <p>{item?.product?.texts?.description}</p>
                    </div>
                  </div>
                  <p className="text-right font-medium text-slate-900 dark:text-slate-100 lg:flex-auto">
                    {renderPrice(item.total)}
                  </p>
                </div>
              </div>
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
                <dt className="font-medium text-slate-900 dark:text-slate-100">
                  {formatMessage({
                    id: 'delivery_address',
                    defaultMessage: 'Delivery address',
                  })}
                </dt>
                <dd className="mt-3 text-slate-500 dark:text-slate-300">
                  <span className="mb-2 block">
                    {user?.profile?.address?.addressLine}
                  </span>
                  <span className="mb-2 block">
                    {user?.profile?.address?.addressLine2}
                  </span>
                  <span className="mb-2 block">
                    {user?.profile?.address?.addressLine2}
                  </span>
                  <span className="mb-2 block">
                    {user?.profile?.address?.city}&#44;&nbsp;
                    {getFlagEmoji(user?.profile?.address?.countryCode)}&nbsp;
                    {user?.profile?.address?.countryCode}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-900">
                  {formatMessage({
                    id: 'delivery_information',
                    defaultMessage: 'Delivery Information',
                  })}
                </dt>
                <dd className="-ml-4 -mt-1 flex flex-wrap">
                  <div className="ml-4 mt-4 flex-shrink-0">
                    <span>{order?.provider?.type}</span>
                    <p className="sr-only">Visa</p>
                  </div>
                  <div className="ml-4 mt-4">
                    <p className="text-slate-900">Ending with 4242</p>
                    <p className="text-slate-600">Expires 02 / 24</p>
                  </div>
                </dd>
              </div>
            </dl>

            {false && (
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
                  <dd className="mt-1 text-sm text-gray-900 dark:text-slate-100">
                    <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                      {order?.documents?.map((document) => (
                        <li
                          key={document._id}
                          className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                        >
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
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
                <dt className="font-medium text-slate-900 dark:text-slate-100">
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
                    {order?.billingAddress?.postalCode}&#44;&nbsp;
                    {order?.billingAddress?.addressLine}
                  </span>
                  <span className="block">
                    {order?.billingAddress?.postalCode}&#44;&nbsp;
                    {order?.billingAddress?.addressLine2}
                  </span>
                  {order?.billingAddress?.countryCode && (
                    <span className="block">
                      {user?.profile?.address?.city}&#44;&nbsp;
                      {/* {getFlagEmoji(order?.billingAddress?.countryCode)}&nbsp; */}
                      {order?.billingAddress?.countryCode}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900 dark:text-slate-100">
                  {formatMessage({
                    id: 'payment_information',
                    defaultMessage: 'Payment information',
                  })}
                </dt>
                <dd className="-ml-4 -mt-1 flex flex-wrap">
                  <div className="ml-4 mt-4 flex-shrink-0">
                    <p className="sr-only">Visa</p>
                  </div>
                  <div className="ml-4 mt-4">
                    <p className="text-slate-900 dark:text-slate-100">
                      Ending with 4242
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      Expires 02 / 24
                    </p>
                  </div>
                </dd>
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
                <dd className="font-medium text-slate-900 dark:text-slate-100">
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
                  {order?.isTaxable}
                </dd>
              </div>
              <div className="flex items-center justify-between pt-4">
                <dt className="font-medium text-slate-900 dark:text-slate-100">
                  {formatMessage({
                    id: 'order_total',
                    defaultMessage: 'Order total',
                  })}
                </dt>
                <dd className="font-medium text-indigo-600 dark:text-lime-600">
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
