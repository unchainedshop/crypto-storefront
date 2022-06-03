import { useIntl } from 'react-intl';

import Image from 'next/image';
import LoginForm from '../modules/auth/components/LoginForm';
import MetaTags from '../modules/common/components/MetaTags';
import useRedirect from '../modules/auth/hooks/useRedirect';
import defaultNextImageLoader from '../modules/common/utils/getDefaultNextImageLoader';

const LogIn = () => {
  const { formatMessage } = useIntl();
  useRedirect({ to: '/account', matchUsers: true });
  return (
    <>
      <MetaTags
        title={formatMessage({ id: 'log_in', defaultMessage: 'Log In' })}
      />
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="relative mx-auto h-10 w-36 rounded">
            <Image
              src="/img/logo.png"
              alt={formatMessage({
                id: 'shop_logo_login',
                defaultMessage: 'Shop logo',
              })}
              layout="fill"
              placeholder="blur"
              blurDataURL="/placeholder.png"
              className="rounded"
              loader={defaultNextImageLoader}
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatMessage({
              id: 'sign_in',
              defaultMessage: 'Sign in',
            })}
          </h2>
        </div>

        <LoginForm />
      </div>
    </>
  );
};

export default LogIn;
