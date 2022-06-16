import { useMutation, useApolloClient, gql } from '@apollo/client';
import { useIntl } from 'react-intl';
import { useAppContext } from '../../common/components/AppContextWrapper';

import CurrentUserFragment from '../fragments/CurrentUserFragment';

export const ResetPassword = gql`
  mutation ResetPassword(
    $newPassword: String!
    $token: String!
    $forceLocale: String
    $currency: String
  ) {
    resetPassword(newPlainPassword: $newPassword, token: $token) {
      id
      token
      tokenExpires
      user {
        ...CurrentUserFragment
      }
    }
  }
  ${CurrentUserFragment}
`;

const useResetPassword = () => {
  const client = useApolloClient();
  const intl = useIntl();
  const { selectedCurrency } = useAppContext();
  const [resetPasswordMutation] = useMutation(ResetPassword);

  const resetPassword = async ({ newPassword, token }) => {
    const { errors } = await resetPasswordMutation({
      variables: {
        newPassword,
        token,
        forceLocale: intl.locale,
        currency: selectedCurrency,
      },
    });

    await client.resetStore();
    return errors;
  };

  return {
    resetPassword,
  };
};

export default useResetPassword;
