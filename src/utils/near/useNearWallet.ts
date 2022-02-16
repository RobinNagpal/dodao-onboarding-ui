import { connect, keyStores, WalletConnection } from 'near-api-js';
import { KeyStore } from 'near-api-js/lib/key_stores/keystore';
import 'regenerator-runtime/runtime';
import { ref } from 'vue';
import { getConfig } from './config';

const nearConfig = getConfig(process.env.NODE_ENV || 'development');

const nearWalletConnection = ref<WalletConnection | null>(null);
const nearAccountId = ref<string | null>(null);
const keyStore = ref<KeyStore>(new keyStores.BrowserLocalStorageKeyStore());

export default function useNearWallet() {
  async function initContract() {
    const near = await connect(
      Object.assign(
        {
          deps: { keyStore: keyStore.value },
          headers: {}
        },
        nearConfig
      )
    );

    nearWalletConnection.value = new WalletConnection(near, null);
    nearAccountId.value = nearWalletConnection.value.getAccountId();
  }

  async function nearLogout() {
    if (!nearWalletConnection.value) {
      await initContract();
    }
    nearWalletConnection.value?.signOut();
  }

  async function nearLogin() {
    if (!nearWalletConnection.value) {
      await initContract();
    }

    if (!nearAccountId.value) {
      await nearWalletConnection.value?.requestSignIn();
      nearAccountId.value = nearWalletConnection.value?.getAccountId();
    }
    return nearAccountId.value;
  }

  return {
    initContract,
    keyStore,
    nearLogin,
    nearLogout,
    nearWalletConnection
  };
}
