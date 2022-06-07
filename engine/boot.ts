import { Meteor } from 'meteor/meteor';
import {
  startPlatform,
  withAccessToken,
  setAccessToken,
} from 'meteor/unchained:platform';


import 'meteor/unchained:core-payment/plugins/cryptopay';

import seed from './seed';

Meteor.startup(async () => {
  const unchainedAPI = await startPlatform({
    introspection: true,
    playground: true,
    tracing: true,
    corsOrigins: (_, callback) => {
      callback(null, true);
    },

    context: withAccessToken(),
  });
  await seed(unchainedAPI);
  await setAccessToken(unchainedAPI, 'admin', process.env.UNCHAINED_SECRET);

  
});
