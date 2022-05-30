import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import getConfig from 'next/config';

import 'react-toastify/dist/ReactToastify.css';
import '../public/static/css/all.css';
import '../styles/globals.css';

import { ApolloProvider } from '@apollo/client';
import { useRouter } from 'next/router';
import IntlWrapper from '../modules/i18n/components/IntlWrapper';
import { CartContext } from '../modules/cart/CartContext';

import { useApollo } from '../modules/apollo/apolloClient';
import Layout from '../modules/layout/components/Layout';
import CurrencyContext from '../modules/common/utils/CurrencyContext';

const {
  publicRuntimeConfig: { localizations },
} = getConfig();

const UnchainedApp = ({ Component, pageProps, router }) => {
  const messages = localizations[router.locale];
  const { locale } = useRouter();
  const apollo = useApollo(pageProps, { locale });

  const toggleCart = (val) => {
    // eslint-disable-next-line no-use-before-define
    setCartContext({
      isCartOpen: val,
      toggleCart,
    });
  };

  const changeCurrency = (currency) => {
    // eslint-disable-next-line no-use-before-define
    setSelectedCurrency({
      selectedCurrency: currency,
      changeCurrency,
    });
  };
  const [cartContext, setCartContext] = useState({
    isCartOpen: false,
    toggleCart,
  });
  const [selectedCurrency, setSelectedCurrency] = useState({
    selectedCurrency: 'EUR',
    changeCurrency,
  });

  return (
    <CurrencyContext.Provider value={selectedCurrency}>
      <ApolloProvider client={apollo}>
        <IntlWrapper
          locale={router.locale}
          messages={messages}
          key="intl-provider"
        >
          <CartContext.Provider value={cartContext}>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              newestOnTop
            />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </CartContext.Provider>
        </IntlWrapper>
      </ApolloProvider>
    </CurrencyContext.Provider>
  );
};

export default UnchainedApp;
