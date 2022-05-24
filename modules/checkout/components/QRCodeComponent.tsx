import React from 'react';
import QRCode from 'react-qr-code';

const contractAddress = '0x33e8b976e6403c5e26a89d242881646a9c75defd';

const QRCodeComponent = () => {
  return (
    <div className="my-4 flex w-full justify-center">
      <div className="rounded-lg border bg-white p-4 drop-shadow-lg">
        <QRCode value={contractAddress} title="Contract for checkout" />
      </div>
    </div>
  );
};

export default QRCodeComponent;
