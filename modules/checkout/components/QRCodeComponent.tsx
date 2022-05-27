import QRCode from 'react-qr-code';

const QRCodeComponent = ({ contractAddress }) => {
  return contractAddress ? (
    <div className="my-4 flex w-full justify-center">
      <div className="rounded-lg border bg-white p-4 drop-shadow-lg">
        <QRCode value={contractAddress} title="Contract for checkout" />
      </div>
    </div>
  ) : null;
};

export default QRCodeComponent;
