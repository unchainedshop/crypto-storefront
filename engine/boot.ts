import { Meteor } from 'meteor/meteor';
import {
  startPlatform,
  withAccessToken,
  setAccessToken,
} from 'meteor/unchained:platform';

import './plugins'
import seed from './seed';

Meteor.startup(async () => {
  const unchainedAPI = await startPlatform({
    introspection: true,
    playground: true,
    tracing: true,
    context: withAccessToken(),
    typeDefs: [],
    resolvers: [],
    corsOrigins: (_, callback) => {
      callback(null, true);
    },
    options: {
      orders: {
        ensureUserHasCart: true,
      },
      accounts: {
        autoMessagingAfterUserCreation: false,
        server: {
          loginExpirationInDays: 0.5,
        },
      },
    },
    

  });
  await seed(unchainedAPI);
  await setAccessToken(unchainedAPI, 'admin', process.env.UNCHAINED_SECRET);

  
});
