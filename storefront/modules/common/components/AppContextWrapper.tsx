import React, { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import { ethers } from 'ethers';
import ConnectPopup from './ConnectPopup';



export const AppContext = React.createContext<{
  hasSigner?: boolean;
  accounts?: string[];

  connect: () => Promise<void>;
  selectedCurrency: string;
  changeCurrency: (val) => void,
  isCartOpen: boolean;
  toggleCart?: (val) => void;
  payWithMetaMask?: (orderAddress: string, orderAmount: string) => void
  
}>({
  accounts: [],
  connect: () => null,

  selectedCurrency: '',
  changeCurrency: () => null,
  isCartOpen: false,
  toggleCart: () => null

});

export const useAppContext = () => useContext(AppContext);

const ethereum = (global as any).ethereum;

export const AppContextWrapper = ({ children }) => {
  
  const [currentProvider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCartOpen, toggleCart] = useState(false)
  const [selectedCurrency, changeCurrency] = useState('')
  
  

  const payWithMetaMask = async (orderAddress, orderAmount) => {
    const params = [{
      from: accounts[0],
      to: orderAddress ,
      value:  ethers.utils.parseUnits(String(orderAmount), 'ether').toHexString()  
  }];
  await currentProvider.provider.send( {method: 'eth_sendTransaction', params}, () => {} )
  }

  useEffect(() => {
    (async () => {
      const scopedProvider = ethereum
        ? new ethers.providers.Web3Provider(ethereum)
       :null
      
      setProvider(scopedProvider);

      const { chainId } = await scopedProvider.getNetwork();
      console.log(chainId)
      setChainId(chainId);

      ethereum?.on('chainChanged', () => window.location.reload());
 

      scopedProvider.on('chainChanged', (chainId) => {
        console.log('chainChanged');
        setChainId(chainId);
      });

      console.log(scopedProvider)
    

      
      if (ethereum) {
        const accounts = await ethereum.request({
          method: 'eth_accounts',
        });

        setAccounts(accounts);

        scopedProvider.on('accountsChanged', (accounts) => {
          console.log('accounts changed');
          setAccounts(accounts);
        });
      }

       
    })();


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
      <ConnectPopup isOpen={modalOpen} connect={doConnect} />
      {children}
    </AppContext.Provider>
  );
};