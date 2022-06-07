import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import useResetPassword from '../modules/auth/hooks/useResetPassword';
import MetaTags from '../modules/common/components/MetaTags';

const PasswordReset = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { token } = router.query;
  const { register, handleSubmit, errors, watch } = useForm();
  const [error, setError] = useState([]);
  const password = useRef({});

  password.current = watch('newPassword', '');
  const { resetPassword } = useResetPassword();

  const onSubmit = async ({ newPassword }) => {
    try {
      await resetPassword({ newPassword, token });
      router.replace('/account');
      return true;
    } catch (e) {
      setError([{ ...e }]);
    }
    return false;
  };

  return (
    <>
      <MetaTags
        title={formatMessage({
          id: 'reset_password',
          defaultMessage: 'Reset password',
        })}
      />
      <div className="mx-auto mt-5 w-full p-10 sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-500">
          <h1 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatMessage({
              id: 'reset_password',
              defaultMessage: 'Reset password',
            })}
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {formatMessage({
                  id: 'new_password',
                  defaultMessage: 'New password',
                })}
              </label>
              <div className="my-1">
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  autoComplete="new-password"
                  ref={register({ required: true })}
                  className={classNames(
                    'block w-full appearance-none rounded-md border border-slate-300 bg-slate-100 py-2 px-3 placeholder-slate-400 shadow-sm transition focus:border-slate-900 focus:text-slate-900 focus:outline-none focus:ring-slate-900 dark:text-slate-600 sm:text-sm',
                    {
                      'border-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500':
                        errors.newPassword,
                    },
                  )}
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-600">
                    {errors.newPassword?.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {formatMessage({
                  id: 'repeat_password',
                  defaultMessage: 'Repeat Password',
                })}
              </label>
              <div className="my-1">
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  autoComplete="new-password"
                  ref={register({
                    validate: (value) =>
                      value === password.current ||
                      'The passwords do not match',
                  })}
                  className={classNames(
                    'block w-full appearance-none rounded-md border border-slate-300 bg-slate-100 py-2 px-3 placeholder-slate-400 shadow-sm transition focus:border-slate-900 focus:text-slate-900 focus:outline-none focus:ring-slate-900 dark:text-slate-600 sm:text-sm',
                    {
                      'border-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500':
                        errors.password2,
                    },
                  )}
                />
              </div>
              {errors.password2 && (
                <p className="text-sm text-red-600">
                  {errors.password2.message}
                </p>
              )}
            </div>
            {error && (
              <ul className="form-error">
                {error.map((e) => (
                  <li className="text-sm text-red-600">{e.message}</li>
                ))}
              </ul>
            )}
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-slate-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              {formatMessage({
                id: 'reset_password',
                defaultMessage: 'Reset password',
              })}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
