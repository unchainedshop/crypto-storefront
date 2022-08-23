import React, {
  useState,
  useContext,
  useEffect,

} from 'react';
import { ethers } from 'ethers';
import ConnectPopup from './ConnectPopup';


import ERC20_ABI from '../data/erc20ABI.json'
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import LoadingItem from './LoadingItem';

const METAMASK_ERROR = {
  4001: 'Payment Canceled',
  32602: 'Invalid data provided',
  32603: 'Internal server error'
}


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
  const [processing, setProcessing] = useState(false)
  const {formatMessage} = useIntl()

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
      async (error, response) => {
        
        if(error && error.code) {
          if(Object.keys(METAMASK_ERROR).includes(error.code.toString())) {
            alert(METAMASK_ERROR[error.code])
          }
          setShowBackDrop(false)
          return
        }
        
        if((response.result.match(/^0x/))) {
        setProcessing(true)
        const interval = setInterval(async () => {
          const transaction = await currentProvider.getTransactionReceipt(response.result);
          if (transaction) {
            console.log(transaction);
            setShowBackDrop(false)
            setProcessing(false)
            clearInterval(interval);
          }
        }, 1000);
          
        }
      },

      
    )
    
    
  } else {
      const contract = new ethers.Contract('0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', ERC20_ABI, currentProvider.getSigner())
      contract.transfer(orderAddress, ethers.utils.parseUnits(price.gweiAmount));
    

  }
  };

  console.log(processing)

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
        
      if (!scopedProvider){

      }
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
      
      {showBackDrop &&
      <div className="align-items-center fixed top-0 left-0 right-0 bottom-0 z-[100000] flex justify-center bg-color-light-dark opacity-95">
        {processing &&
        <div className="absolute mx-auto mt-40 w-1/4 max-w-lg bg-white p-5">
          
        <p>
            {formatMessage({
              id: 'processing_payment',
              defaultMessage:
                'Processing payment, this might take few seconds to a minute',
                
            })}
            
            <img  src='/static/img/spinner-icon.gif'/>
          </p>


        </div>
}
        </div>
}
      <ConnectPopup isOpen={modalOpen} connect={doConnect} />
      {children}
    </AppContext.Provider>
  );
};
