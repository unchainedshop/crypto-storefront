import React from 'react';
import Link from 'next/link';
import { useIntl } from 'react-intl';

import MetaTags from '../modules/common/components/MetaTags';

const ServerError = () => {
  const { formatMessage } = useIntl();
  return (
    <>
      <MetaTags title="500: oops, something went wrong" />
      <div className="text-danger container p-4 text-center md:p-12">
        <div className="mb-6 lg:p-12">
          <h1 className="font-[bolder]">500 - Server-side error occurred</h1>
          <div className="mb-12">
            <div className="text-center">
              <p>
                {formatMessage({ id: '505_sorry', defaultMessage: 'Sorry' })}
              </p>
              <Link href="/">
                <a className="button button--primary">
                  {formatMessage({
                    id: 'back_to_home',
                    defaultMessage: 'Back to Home',
                  })}
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div />
      </div>
    </>
  );
};

export default ServerError;
