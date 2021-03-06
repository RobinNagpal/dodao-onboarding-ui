import { Blockchain, getBlockchain } from '@/helpers/network';
import { AuthConnector, isSolanaConnector } from '@/utils/auth/authConnector';
import Connector from '@/utils/auth/connector';
import { CustomProvider } from '@/utils/auth/customProvider';
import { SolanaProvider } from '@/utils/solana/solanaProvider';
import { useSolanaWallet } from '@/utils/solana/useSolanaWallet';
import { Web3Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';
import { WalletName } from '@solana/wallet-adapter-base';
import { Ref } from '@vue/reactivity';
import { ref } from 'vue';
import Lock from './lock';

const name = 'lock';

export interface DoDAOAuth {
  isAuthenticated: boolean;
  provider: Ref;
  lockClient: Lock;
  login: (connector: AuthConnector) => Promise<Web3Provider>;
  logout: () => Promise<void>;
  getConnector: Connector | boolean;
  web3: Web3Provider | Wallet | CustomProvider | SafeAppProvider | null;
}

let instance;

export const getInstance = () => instance;

export const useLock = ({ ...options }) => {
  if (instance) return instance;

  const isAuthenticated = ref(false);
  const provider = ref();

  const lockClient = new Lock();
  options.connectors.forEach(connector => {
    lockClient.addConnector(connector);
  });

  async function login(connector: AuthConnector) {
    console.log('login using connector', connector);
    let localProvider;
    if (getBlockchain() === Blockchain.SOL) {
      await useSolanaWallet().select(connector.toString() as WalletName);
      const wallet = await useSolanaWallet().connectAndReturnWallet();
      console.log('logged in with solana wallet', wallet);
      if (wallet) {
        localProvider = new SolanaProvider(connector.toString());
      } else {
        window.location.reload();
      }
    } else {
      const lockConnector = lockClient.getConnector(connector);
      localProvider = await lockConnector.connect();
    }
    if (localProvider !== null) {
      provider.value = localProvider;
    }
    if (provider.value) {
      localStorage.setItem(`_${name}.connector`, connector);
      isAuthenticated.value = true;
    }
    return provider;
  }

  async function logout() {
    if (getBlockchain() === Blockchain.SOL) {
      await useSolanaWallet().disconnect();
      return;
    }
    const connector = await getConnector();
    if (connector) {
      const lockConnector = lockClient.getConnector(connector);
      await lockConnector.logout();
      localStorage.removeItem(`_${name}.connector`);
      isAuthenticated.value = false;
      provider.value = null;
    }
  }

  async function getConnector() {
    const connector = localStorage.getItem(`_${name}.connector`);

    if (getBlockchain() === Blockchain.ETH && connector) {
      const lockConnector = lockClient.getConnector(connector as AuthConnector);
      const isLoggedIn = await lockConnector.isLoggedIn();
      return isLoggedIn ? connector : false;
    } else if (getBlockchain() === Blockchain.SOL && connector) {
      return isSolanaConnector(connector as AuthConnector) ? connector : false;
    } else if (getBlockchain() === Blockchain.NEAR) {
      return connector ? AuthConnector.near : false;
    }
    return connector;
  }

  instance = {
    isAuthenticated,
    provider,
    lockClient,
    login,
    logout,
    getConnector,
    web3: null
  };

  return instance;
};

export const LockPlugin = {
  install(app, options) {
    console.log('options', options);
    app.config.globalProperties.$auth = useLock(options);
  }
};
