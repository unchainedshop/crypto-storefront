import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useAppContext } from '../../common/components/AppContextWrapper';
import useSignForCheckout from '../hooks/useSignForCheckout';
import QRCodeComponent from './QRCodeComponent';

const PayWithMetaMask = ({ user, showQr = false }) => {
  const { formatMessage } = useIntl();
  const [contractAddress, setContractAddress] = useState([]);
  const { hasSigner, payWithMetaMask } = useAppContext();

  const { signForCheckout } = useSignForCheckout();

  const signOrderPayment = async () => {
    if (user?.cart?.paymentInfo?.provider?.type === 'GENERIC') {
      const response = await signForCheckout({
        orderPaymentId: user?.cart?.paymentInfo?._id,
        transactionContext: {},
      });
      return JSON.parse(response || '[]');
    }

    return [];
  };

  useEffect(() => {
    const updateContractAddress = async () => {
      setContractAddress(await signOrderPayment());
    };
    updateContractAddress();
  }, [user?.cart?.paymentInfo?.provider?._id]);

  return (
    <>
      {user?.cart?.paymentInfo?.provider?.interface?._id ===
        'shop.unchained.payment.cryptopay' &&
        contractAddress?.map((address) => (
          <div key={address}>
            {showQr && (
              <div className="flex">
                <QRCodeComponent paymentAddress={address} />
              </div>
            )}
            {hasSigner && (
              <button
                type="button"
                className=" mt-3 inline-flex w-full items-center justify-center rounded-md border-2 border-[#F6851B] bg-[#F6851B] px-3 py-2 text-center text-sm font-medium leading-4 text-slate-100 shadow hover:bg-[#E2761B] focus:outline-none focus:ring-2 focus:ring-[#F6851B] focus:ring-offset-2"
                onClick={() => {
                  payWithMetaMask(address.address, user?.cart.total);
                }}
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
            )}
          </div>
        ))}
    </>
  );
};

export default PayWithMetaMask;
