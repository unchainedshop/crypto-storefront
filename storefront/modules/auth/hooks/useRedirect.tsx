import { useEffect } from 'react';
import { useRouter } from 'next/router';

import useUser from './useUser';

const useRedirect = ({
  to,
  replace = false,
  matchAnonymous = false,
  matchUsers = false,
  matchGuests = false,
}) => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;

    const isAnonymousMatched = !user && matchAnonymous;
    const isUserMatched = user && !user.isGuest && matchUsers;
    const isGuestMatched = user && user.isGuest && matchGuests;

    if (isAnonymousMatched || isUserMatched || isGuestMatched) {
      // pattern matched, push
      if (replace) {
        router.replace({ pathname: to });
      } else {
        router.push({ pathname: to });
      }
    }
  }, [user]);

  return null;
};

export default useRedirect;
