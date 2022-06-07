import { useMutation, gql } from '@apollo/client';
import { storeLoginToken } from '../utils/store';

const LoginAsGuestMutation = gql`
  mutation LoginAsGuest {
    loginAsGuest {
      id
      token
      tokenExpires
    }
  }
`;

const useLoginAsGuest = () => {
  const [loginAsGuestMutation] = useMutation(LoginAsGuestMutation);

  const loginAsGuest = async () => {
    const { data, context, errors, extensions } = await loginAsGuestMutation();

    const { id, token, tokenExpires } = data?.loginAsGuest || {};

    await storeLoginToken(id, token, new Date(tokenExpires));

    return { data, context, errors, extensions };
  };

  return {
    loginAsGuest,
  };
};

export default useLoginAsGuest;
