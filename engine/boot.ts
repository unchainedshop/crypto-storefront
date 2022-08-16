import './load_env';
import express from 'express';

import { startPlatform, withAccessToken, setAccessToken } from '@unchainedshop/platform';

import loginWithSingleSignOn from './login-with-single-sign-on';
import seed from './seed';
import cryptoModule from './modules'
import { setupGridFSWebhook, configureGridFSFileUploadModule } from './plugins';
import typeDefs from './api/schema';
import resolvers from './api/resolvers';

const start = async () => {
  const app = express();

  const unchainedAPI = await startPlatform({
    expressApp: app,
    introspection: true,
    playground: true,
    tracing: true,
    typeDefs,
    resolvers: [resolvers],
    modules: {
      cryptoModule,
      gridfsFileUploads: {
        configure: configureGridFSFileUploadModule,
      },
    },
    options: {
      orders: {
        ensureUserHasCart: true
      },
      accounts: {
        autoMessagingAfterUserCreation: false,
        mergeUserCartsOnLogin: true,
        server: {
          loginExpirationInDays: 0.5,
        }
      },
    },
    context: withAccessToken(),
  });

  await seed(unchainedAPI);
  await setAccessToken(unchainedAPI, 'admin', process.env.UNCHAINED_SECRET);

  // The following lines will activate SSO from Unchained Cloud to your instance,
  // if you want to further secure your app and close this rabbit hole,
  // remove the following lines
  const singleSignOn = loginWithSingleSignOn(unchainedAPI);
  app.use('/', singleSignOn);
  app.use('/.well-known/unchained/cloud-sso', singleSignOn);
  // until here

  setupGridFSWebhook(app);
  // setupCryptopay(app);
  // setupCryptopayPricing(app);

  await app.listen({ port: process.env.PORT || 3000 });
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 3000}`);
};

start();
