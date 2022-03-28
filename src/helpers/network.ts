import networks from '@dodao/onboarding-schemas/config/networks.json';

export enum Blockchain {
  ETH = 'ETH',
  NEAR = 'NEAR',
  SOL = 'SOL',
  ONE = 'ONE'
}

export function getBlockchain(): Blockchain {
  return (import.meta.env.VITE_BLOCKCHAIN as Blockchain) ?? Blockchain.ETH;
}

export function getNetworks() {
  const blockchain = getBlockchain();
  return networks[blockchain.toString()];
}

export function getDefaultNetworkConfig() {
  const defaultNetwork: any = import.meta.env.VITE_DEFAULT_NETWORK;
  return getNetworks()[defaultNetwork];
}
