import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useAppContext } from '../../common/components/AppContextWrapper';
import useSetOrderPaymentProvider from '../../orders/hooks/setPaymentOrderProvider';
import useSignForCheckout from '../hooks/useSignForCheckout';
import CardPaymentForm from './CardPaymentForm';
import QRCodeComponent from './QRCodeComponent';

const PaymentMethod = ({ user }) => {
  const { formatMessage } = useIntl();
  const { hasSigner, payWithMetaMask } = useAppContext();

  const { setOrderPaymentProvider } = useSetOrderPaymentProvider();
  const { signForCheckout } = useSignForCheckout();
  const [contractAddress, setContractAddress] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    user?.cart?.paymentInfo?.provider?._id,
  );

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

  useEffect(() => {
    const updatePaymentMethod = async () => {
      await setOrderPaymentProvider({
        orderId: user?.cart?._id,
        paymentProviderId: selectedPaymentMethod,
      });
    };

    updatePaymentMethod();
  }, [selectedPaymentMethod]);

  return (
    <div className="mt-10 border-y border-slate-200 py-10">
      <RadioGroup
        value={selectedPaymentMethod}
        onChange={setSelectedPaymentMethod}
      >
        <RadioGroup.Label className="text-lg font-medium text-slate-900 dark:text-white">
          {formatMessage({
            id: 'payment',
            defaultMessage: 'Payment',
          })}
        </RadioGroup.Label>

        <fieldset className="mt-4">
          <legend className="sr-only">
            {formatMessage({
              id: 'payment_type',
              defaultMessage: 'Payment type',
            })}
          </legend>
          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            {user?.cart?.supportedPaymentProviders?.map((paymentMethod) => (
              <RadioGroup.Option
                key={paymentMethod._id}
                value={paymentMethod._id}
                className={({ checked, active }) =>
                  classNames(
                    'relative flex cursor-pointer rounded-lg border border-slate-300 bg-white p-4 shadow-sm focus:outline-none dark:bg-slate-500',
                    {
                      'border-transparent': checked,
                      'ring-2 ring-indigo-500 dark:ring-indigo-800': active,
                    },
                  )
                }
              >
                {({ checked, active }) => (
                  <>
                    <div className="flex flex-1">
                      <div className="flex flex-col">
                        <RadioGroup.Label
                          as="span"
                          className="block text-sm font-medium text-slate-900 dark:text-white"
                        >
                          {paymentMethod?.interface?.label}&nbsp;
                          {paymentMethod?.interface?.version}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className="mt-1 flex items-center text-sm text-slate-500 dark:text-slate-100"
                        >
                          {paymentMethod?.type}
                        </RadioGroup.Description>
                      </div>
                    </div>
                    {checked ? (
                      <CheckCircleIcon
                        className="h-5 w-5 text-indigo-600 dark:text-indigo-800"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div
                      className={classNames(
                        'pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent',
                        {
                          border: active,
                          'border-indigo-500': checked,
                        },
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </fieldset>
      </RadioGroup>

      <div className="mt-4">
        {user?.cart?.paymentInfo?.provider?.interface?._id ===
          'shop.unchained.payment.cryptopay' &&
          contractAddress?.map((address) => (
            <div key={address}>
              <div className="flex">
                <QRCodeComponent paymentAddress={address} />
              </div>
              {hasSigner && (
                <button
                  type="button"
                  className="mt-3 inline-flex items-center rounded-md border-2 border-[#F6851B] bg-[#F6851B] px-3 py-2 text-sm font-medium leading-4 text-slate-100 shadow hover:bg-[#E2761B] focus:outline-none focus:ring-2 focus:ring-[#F6851B] focus:ring-offset-2"
                  onClick={() =>
                    payWithMetaMask(address.address, user?.cart.total)
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
              )}
            </div>
          ))}
      </div>

      <div className="mt-4">
        {user?.cart?.paymentInfo?.provider?.type === 'CARD' ? (
          <CardPaymentForm />
        ) : null}
      </div>
    </div>
  );
};

export default PaymentMethod;
