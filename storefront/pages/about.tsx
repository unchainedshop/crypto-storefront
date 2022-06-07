import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import MetaTags from '../modules/common/components/MetaTags';

const AboutUs = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const { formatMessage } = useIntl();
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <>
      <MetaTags
        title={formatMessage({ id: 'about', defaultMessage: 'About' })}
        url={currentUrl}
      />
      <div className="container">
        <div className="-mr-4 -ml-4 flex flex-wrap">
          <div className="relative w-full px-4 md:ml-[16.666667%] md:max-w-[66.666667%] md:flex-shrink-0 md:flex-grow-0 md:basis-2/3">
            <h1>{formatMessage({ id: 'about', defaultMessage: 'About' })}</h1>
            <p>
              {formatMessage({
                id: 'about_detail',
                defaultMessage: 'About Detail',
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
