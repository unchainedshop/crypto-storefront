import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';

const QRCodeComponent = ({ contractAddress }) => {
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
    <div onClick={copyToClipboard} className="my-4 flex w-full justify-center">
      <div className="rounded-lg border bg-white p-4 drop-shadow-lg">
        <QRCode value={contractAddress} title="Contract for checkout" />
      </div>
    </div>
  ) : null;
};

export default QRCodeComponent;
