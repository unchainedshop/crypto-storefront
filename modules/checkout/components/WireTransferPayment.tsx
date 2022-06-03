import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import useCheckoutCart from '../hooks/useCheckoutCart';

const DatatransPayment = ({ cart, setBillingSameAsDelivery }) => {
  const intl = useIntl();
  const [isPaymentButtonDisabled, setPaymentButtonDisabled] = useState(false);
  const { checkoutCart } = useCheckoutCart();
  const router = useRouter();

  const checkout = async ({
    paymentContext = undefined,
    deliveryContext = undefined,
    orderContext = undefined,
  } = {}) => {
    if (cart?.deliveryInfo?.address === null) setBillingSameAsDelivery();
    await checkoutCart({
      orderId: cart._id,
      orderContext,
      paymentContext,
      deliveryContext,
    });

    router.replace({
      pathname: '/thank-you',
      query: { orderId: cart._id },
    });
  };

  return (
    <button
      type="button"
      role="link"
      disabled={isPaymentButtonDisabled}
      className="mt-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={async () => {
        setPaymentButtonDisabled(true);
        await checkout(cart);
        setPaymentButtonDisabled(false);
      }}
    >
      {intl.formatMessage({
        id: 'confirm_purchase',
        defaultMessage: 'Confirm purchase',
      })}
    </button>
  );
};

export default DatatransPayment;
