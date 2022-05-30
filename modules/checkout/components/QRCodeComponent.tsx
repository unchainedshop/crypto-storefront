import classNames from 'classnames';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';

const QRCodeComponent = ({
  paymentAddress,
  className = '',
  currencyClassName = '',
}) => {
  const copyToClipboard = () => {
    try {
      if ('clipboard' in navigator) {
        navigator.clipboard.writeText(paymentAddress.address);
      }
      document.execCommand('copy', true, paymentAddress.address);
      toast.success('Copied to clipboard', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.message);
    }
  };

  return paymentAddress ? (
    <div className="relative w-full">
      <div
        className={classNames(
          'my-2 text-center text-lg font-bold text-slate-600 dark:text-slate-200',
          currencyClassName,
        )}
      >
        {paymentAddress.currency}
      </div>
      <div
        onClick={copyToClipboard}
        className={classNames(
          "relative mx-auto my-4 w-fit after:invisible after:absolute after:left-2 after:top-0 after:z-10 after:h-fit after:rounded after:bg-slate-900 after:px-2 after:py-1 after:text-white after:opacity-0 after:transition after:content-['Click_to_copy'] hover:cursor-pointer hover:after:visible hover:after:opacity-100",
          className,
        )}
      >
        <div className="rounded-lg border bg-white p-4 drop-shadow-lg">
          <QRCode
            value={paymentAddress.address}
            title="Contract for checkout"
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default QRCodeComponent;
