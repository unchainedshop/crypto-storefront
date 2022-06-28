/* eslint-disable react/no-danger */
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import { LoginIcon, LogoutIcon } from '@heroicons/react/outline';
import LoginForm from '../modules/auth/components/LoginForm';
import MetaTags from '../modules/common/components/MetaTags';
import ManageCart from '../modules/cart/components/ManageCart';
import useUser from '../modules/auth/hooks/useUser';
import Tab from '../modules/common/components/Tab';
import SignUpComponent from '../modules/common/components/SignUpComponent';

const GetCurrentTab = ({ selectedView }) => {
  const router = useRouter();
  const { formatMessage } = useIntl();

  const onLogin = () => router.replace('/review');

  if (selectedView === 'signup') {
    return (
      <div className="w-full rounded-md border-2 bg-white px-4 py-4 shadow dark:bg-slate-600 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <h2 className="mx-auto w-2/3 text-center text-2xl font-bold text-slate-700 dark:text-slate-300">
          {formatMessage({
            id: 'new_here',
            defaultMessage: 'New here',
          })}
        </h2>
        <p className="mx-auto my-4 mb-4 w-2/3 text-center text-lg font-bold text-slate-700 dark:text-slate-300">
          {formatMessage({
            id: 'new_here_message',
            defaultMessage: 'New here message',
          })}
        </p>
        <SignUpComponent />
      </div>
    );
  }
  return (
    <div className="relative w-full rounded-md border-2 bg-white pb-8 shadow dark:bg-slate-600 dark:shadow-white">
      <h2 className="mx-auto my-4 w-2/3 text-center text-2xl font-bold text-slate-700 dark:text-slate-300">
        {formatMessage({
          id: 'welcome_back',
          defaultMessage: 'Welcome back',
        })}
      </h2>
      <p className="mx-auto my-4 w-2/3 text-center text-lg font-bold text-slate-700 dark:text-slate-300">
        {formatMessage({
          id: 'welcome_back_message',
          defaultMessage: 'Welcome back message',
        })}
      </p>
      <LoginForm onLogin={onLogin} />
    </div>
  );
};

const SignUp = () => {
  const { formatMessage } = useIntl();
  const { user } = useUser();

  const tabOptions = [
    {
      id: 'login',
      title: formatMessage({
        id: 'login',
        defaultMessage: 'Login',
      }),
      Icon: <LoginIcon className="h-5 w-5" />,
    },

    {
      id: 'signup',
      title: formatMessage({
        id: 'signup',
        defaultMessage: 'Sign up',
      }),
      Icon: <LogoutIcon className="h-5 w-5" />,
    },
  ];

  return (
    <>
      <MetaTags
        title={`${formatMessage({
          id: 'log_in',
          defaultMessage: 'Log In',
        })} or ${formatMessage({
          id: 'register',
          defaultMessage: 'Register',
        })}`}
      />
      <div className="lg:grid lg:grid-cols-2">
        <div className="mt-2 px-4">
          <Tab tabItems={tabOptions} defaultTab="login">
            <GetCurrentTab />
          </Tab>
        </div>
        <div className="p-4">
          <ManageCart user={user} />
        </div>
      </div>
    </>
  );
};

export default SignUp;
