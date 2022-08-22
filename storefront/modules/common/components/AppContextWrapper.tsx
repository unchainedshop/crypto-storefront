import React, {
  useState,
  useContext,
  useEffect,

} from 'react';
import { ethers } from 'ethers';
import ConnectPopup from './ConnectPopup';

import ERC20_ABI from '../data/erc20ABI.json'

export const AppContext = React.createContext<{
  hasSigner?: boolean;
  accounts?: string[];

  connect: () => Promise<void>;
  selectedCurrency: string;
  changeCurrency: (val) => void;
  isCartOpen: boolean;
  toggleCart?: (val) => void;
  payWithMetaMask?: (orderAddress: string, orderAmount: string) => void;
}>({
  accounts: [],
  connect: () => null,

  selectedCurrency: '',
  changeCurrency: () => null,
  isCartOpen: false,
  toggleCart: () => null,
});

export const useAppContext = () => useContext(AppContext);

const ethereum = (global as any).ethereum;

export const AppContextWrapper = ({ children }) => {
  const [currentProvider, setProvider] =
    useState<ethers.providers.Web3Provider>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCartOpen, toggleCart] = useState(false);
  const [selectedCurrency, setCurrency] = useState('');
  const [showBackDrop, setShowBackDrop] = useState(false);

  const payWithMetaMask = async (orderAddress, price) => {

    if (!accounts.length) {
      alert(
        'You are not logged in metamask, please log into your metamask account and try again!',
      );
      return;
    }
    setShowBackDrop(!showBackDrop)
    let params;
    if(price.currency === 'ETH') {
    params = [
      {
        from: accounts[0],
        to: orderAddress,
        value: ethers.utils
          .parseUnits(String(price.gweiAmount / 1000000000), 'ether')
          .toHexString(),
      },
    ];
    
     await currentProvider.provider.send(
      { method: 'eth_sendTransaction', params },
      (error, respose) => {
        setShowBackDrop(false)
        if(error && error.code) {
          if(error.code === 4001) {
            alert('Payment Canceled')
          }
        }
        console.log('error   ', error)
        console.log('response  ', respose)

      },
    );
    currentProvider.on('transactionHash', (hash) => {
      console.log('inside transaction hash ', hash)
    })

    currentProvider.on('confirmation', (confirmation, reciept) => {
      console.log('inside confirmation ', reciept)
      console.log('inside confirmation ', confirmation)
    })
    currentProvider.on('receipt', (hash) => {
      console.log('inside reciept ', hash)
    })
    currentProvider.on('error', (hash) => {
      console.log('inside error ', hash)
    })
  } else {
      const contract = new ethers.Contract('0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', ERC20_ABI, currentProvider.getSigner())
      contract.transfer(orderAddress, ethers.utils.parseUnits(price.gweiAmount));

  }
  };

  const changeCurrency = async (val) => {
    if(typeof(window) !== 'undefined') {
    setCurrency(val)
      localStorage.setItem('selectedCurrency', val)
    }
    
  }

  useEffect(() => {
    (async () => {
      const scopedProvider = ethereum
        ? new ethers.providers.Web3Provider(ethereum)
        : null;
        
      if (!scopedProvider) return;
      setProvider(scopedProvider);

      ethereum?.on('chainChanged', () => window.location.reload());

      if (ethereum) {
        const accounts = await ethereum.request({
          method: 'eth_accounts',
        });

        setAccounts(accounts);
        
        ethereum.on('accountsChanged', (accounts) => {
          setAccounts(accounts);
        });
      }
    })();
    (typeof(window) != 'undefined')
    changeCurrency(localStorage.getItem('selectedCurrency'))
    
  }, []);

  

  const doConnect = async () => {
    setModalOpen(false);
    await ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await ethereum.request({
      method: 'eth_accounts',
    });
    setAccounts(accounts);
  };

  const connect = async () => setModalOpen(true);

  return (
    <AppContext.Provider
      value={{
        hasSigner: !!ethereum,
        accounts,
        connect,
        isCartOpen,
        toggleCart,
        selectedCurrency,
        changeCurrency,
        payWithMetaMask,
      }}
    >
      {showBackDrop && (
        <div className="fixed top-0 left-0 h-full w-full bg-black  opacity-90 z-50" />
      )}
      <ConnectPopup isOpen={modalOpen} connect={doConnect} />
      {children}
    </AppContext.Provider>
  );
};
