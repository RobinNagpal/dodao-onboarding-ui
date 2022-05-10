import { getDefaultNetworkConfig, getNetworks } from '@/helpers/network';
import { getProfiles } from '@/helpers/profile';
import { DoDAOAuth, getInstance } from '@/utils/auth/auth';
import { AuthConnector, isSolanaConnector } from '@/utils/auth/authConnector';
import { getValidDecodedToken } from '@/utils/auth/jwtUtil';
import useNearWallet from '@/utils/near/useNearWallet';
import { useSolanaWallet } from '@/utils/solana';
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { computed, reactive } from 'vue';

let auth: DoDAOAuth;
const networks = getNetworks();

export interface Network {
  name: string;
  key: string;
  networkId: string;
  testnet?: boolean;
}

export type Blockchain = 'ETH' | 'NEAR' | 'SOL' | 'ONE';

export interface Web3Account {
  account: string;
  network: Network;
  authLoading: boolean;
  profile: string | null;
  walletConnectType: string | null;
  isTrezor: boolean;
  blockchain: Blockchain;
}

const state = reactive<Web3Account>({
  account: '',
  network: getDefaultNetworkConfig(),
  authLoading: false,
  profile: null,
  walletConnectType: null,
  isTrezor: false,
  blockchain: (import.meta.env.VITE_BLOCKCHAIN as Blockchain) ?? 'ETH'
});
const nearWallet = useNearWallet();

export function useWeb3() {
  async function restoreSession() {
    const decodedToken = getValidDecodedToken();
    console.log('restoreSession - decodedToken', decodedToken);
    if (decodedToken) {
      const acc = decodedToken.accountId;
      const profiles = await getProfiles([acc]);
      state.account = acc;
      state.profile = profiles[acc];
    }

    console.log('restoreSession - state', state);
  }
  async function login(connector: AuthConnector = AuthConnector.injected) {
    state.isTrezor = connector === AuthConnector.trezor;
    if (state.blockchain === 'NEAR') {
      connector = AuthConnector.near;
    }
    auth = getInstance();
    state.authLoading = true;
    await auth.login(connector);

    if (auth.provider.value) {
      if (connector === AuthConnector.near || isSolanaConnector(connector)) {
        auth.web3 = auth.provider.value;
      } else {
        auth.web3 = new Web3Provider(auth.provider.value, 'any');
      }

      await loadProvider();
    }
    state.authLoading = false;
  }

  function logout() {
    auth = getInstance();
    auth.logout();
    state.account = '';
    state.profile = null;
    state.isTrezor = false;
  }

  async function loadProvider() {
    try {
      if (
        auth.provider.value?.removeAllListeners &&
        !auth.provider.value?.isTorus
      ) {
        auth.provider.value.removeAllListeners();
      }

      if (auth.provider.value?.on) {
        auth.provider.value.on('chainChanged', async chainId => {
          handleChainChanged(parseInt(formatUnits(chainId, 0)));
        });
        auth.provider.value.on('accountsChanged', async accounts => {
          if (accounts.length !== 0) {
            state.account = accounts[0];
            await login();
          }
        });
        // auth.provider.on('disconnect', async () => {});
      }
      console.log('Provider', auth.provider.value);
      let network, accounts;
      try {
        const connector = auth.provider.value?.connectorName;
        if (connector === 'near') {
          network = {
            chainId: nearWallet.nearWalletConnection.value!._networkId
          };
          accounts = [nearWallet.nearWalletConnection.value!.getAccountId()];
          state.account = accounts[0];
          state.profile = accounts[0];
        } else if (isSolanaConnector(connector)) {
          const { publicKey } = useSolanaWallet();

          network = {
            chainId: WalletAdapterNetwork.Mainnet
          };

          accounts = [publicKey.value?.toBase58()];
          state.account = accounts[0];
          state.profile = accounts[0];
        } else {
          console.log('connector', connector);
          if (connector === 'gnosis') {
            const { chainId: safeChainId, safeAddress } = (auth.web3 as any)
              ?.provider?.safe;

            network = { chainId: safeChainId };
            accounts = [safeAddress];
          } else {
            const web3 = auth.web3 as Web3Provider;
            [network, accounts] = await Promise.all([
              web3?.getNetwork(),
              web3?.listAccounts()
            ]);
          }
          handleChainChanged(network.chainId);
          const acc = accounts.length > 0 ? accounts[0] : null;
          const profiles = await getProfiles([acc]);

          state.account = acc;
          state.walletConnectType =
            auth.provider.value?.wc?.peerMeta?.name || null;
          state.profile = profiles[acc];
        }
      } catch (e) {
        console.log(e);
      }
      console.log('Network', network);
      console.log('Accounts', accounts);
    } catch (e) {
      state.account = '';
      state.profile = null;
      return Promise.reject(e);
    }
  }

  function handleChainChanged(chainId) {
    if (!networks[chainId]) {
      networks[chainId] = {
        ...getDefaultNetworkConfig(),
        chainId,
        name: 'Unknown',
        network: 'unknown',
        unknown: true
      };
    }
    state.network = networks[chainId];
  }

  return {
    login,
    logout,
    handleChainChanged,
    restoreSession,
    web3: computed(() => state),
    isEthBlockchain: computed(() => state.blockchain === 'ETH'),
    isSolBlockchain: computed(() => state.blockchain === 'SOL'),
    isNearBlockchain: computed(() => state.blockchain === 'NEAR'),
    isOneBlockchain: computed(() => state.blockchain === 'ONE'),
    web3Account: computed(() => state.account)
  };
}
