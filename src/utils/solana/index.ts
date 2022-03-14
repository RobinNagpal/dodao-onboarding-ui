import { App } from 'vue';
import { WalletStoreProps } from './createWalletStore';
import { initWallet, useSolanaWallet } from './useSolanaWallet';

export * from './createWalletStore';
export * from './errors';
export * from './useAnchorWallet';
export * from './useSolanaWallet';

export default {
  install: (app: App, options: WalletStoreProps = {}) => {
    initWallet(options);
    app.config.globalProperties.$wallet = useSolanaWallet();
  }
};
