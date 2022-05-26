import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { QRCode } from 'react-qr-svg';

import useOrderDetail from '../modules/orders/hooks/useOrderDetail';
import MetaTags from '../modules/common/components/MetaTags';

const ThankYou = () => {
  const router = useRouter();
  const intl = useIntl();

  if (!router.query.orderId) return '';
  const { order } = useOrderDetail({
    orderId: router.query?.orderId,
  });

  return (
    <>
      <MetaTags
        title={intl.formatMessage({ id: 'thank_you' })}
        description={intl.formatMessage({ id: 'thank_you_description' })}
      />
      <div className="mt-5">
        <div className="mx-4 flex flex-wrap">
          <div className="relative w-full px-4 md:ml-[16.666667%] md:max-w-2/3 md:flex-6">
            <h1>{intl.formatMessage({ id: 'thank_you_header' })}</h1>
            {order && (
              <>
                <p>{intl.formatMessage({ id: 'thank_you_description' })}</p>
                <h4>
                  {intl.formatMessage({ id: 'thank_you_order_number' })}
                  {order.orderNumber}
                </h4>
                <p>
                  {intl.formatMessage({ id: 'thank_you_order_date' })}
                  {intl.formatDate(order.created)}
                </p>
                {order?.payment?.provider?.interface?._id ===
                  'shop.unchained.payment.bity' && (
                  <div>
                    <p>
                      Please send <b>{order.meta.bityOrder.input.amount}</b>
                      {order.meta.bityOrder.input.currency} to
                    </p>
                    <QRCode
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="Q"
                      style={{ width: 128 }}
                      value={
                        order.meta.bityOrder.payment_details.crypto_address
                      }
                      className="mb-4 block"
                    />
                    <small>
                      Bitcon Destination Address:{' '}
                      {order.meta.bityOrder.payment_details.crypto_address}
                    </small>

                    <p>
                      Once you have submitted the money,{' '}
                      <b>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://go.bity.com/order-status?id=${order.meta.bityOrder.id}`}
                        >
                          you can check here
                        </a>
                      </b>{' '}
                      to see the status of your payment, and
                      <b>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`/orders/${order._id}`}
                        >
                          here to check when the order is confirmed
                        </a>
                      </b>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYou;
