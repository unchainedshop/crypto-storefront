import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import MetaTags from '../modules/common/components/MetaTags';

const Imprint = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const intl = useIntl();
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <>
      <MetaTags
        title={intl.formatMessage({ id: 'imprint', defaultMessage: 'imprint' })}
        url={currentUrl}
      />
      <div className="mx-4 flex flex-wrap">
        <div className="relative w-full px-4 md:ml-[16.666667%] md:max-w-2/3 md:flex-6">
          <h1>
            {intl.formatMessage({ id: 'imprint', defaultMessage: 'imprint' })}
          </h1>
          <p>...</p>
        </div>
      </div>
    </>
  );
};

export default Imprint;
