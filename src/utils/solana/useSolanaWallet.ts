import {
  createWalletStore,
  WalletStore,
  WalletStoreProps
} from './createWalletStore';
import { WalletNotInitializedError } from './errors';

let walletStore: WalletStore | null = null;

export const useSolanaWallet = (): WalletStore => {
  if (walletStore) return walletStore;
  throw new WalletNotInitializedError(
    'Wallet not initialized. Please use the `initWallet` method to initialize the wallet.'
  );
};

export const initWallet = (walletStoreProps: WalletStoreProps): void => {
  walletStore = createWalletStore(walletStoreProps);
};
