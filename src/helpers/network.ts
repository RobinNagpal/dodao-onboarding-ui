import networks from '@/helpers/networks.json';

export enum Blockchain {
  ETH = 'ETH',
  NEAR = 'NEAR'
}

export function getBlockchain(): Blockchain {
  return (import.meta.env.VITE_BLOCKCHAIN as Blockchain) ?? Blockchain.ETH;
}

export function getNetworks() {
  const blockchain = getBlockchain();
  return networks[blockchain.toString()];
}
