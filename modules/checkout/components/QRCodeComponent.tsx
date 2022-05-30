import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';

const QRCodeComponent = ({ contractAddress, user }) => {
  const copyToClipboard = () => {
    try {
      if ('clipboard' in navigator) {
        navigator.clipboard.writeText(contractAddress);
      }
      document.execCommand('copy', true, contractAddress);
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

  return contractAddress ? (
    <div
      onClick={copyToClipboard}
      className="relative my-4 flex w-full justify-center after:invisible after:relative after:left-2 after:top-0 after:z-10 after:h-fit after:rounded after:bg-slate-900 after:px-2 after:py-1 after:text-white after:opacity-0 after:transition after:content-['Click_to_copy'] hover:cursor-pointer hover:after:visible hover:after:opacity-100"
    >
      {console.log(user)}
      <div className="rounded-lg border bg-white p-4 drop-shadow-lg">
        <QRCode value={contractAddress} title="Contract for checkout" />
      </div>
    </div>
  ) : null;
};

export default QRCodeComponent;
