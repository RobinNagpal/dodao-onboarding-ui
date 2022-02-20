import networks from '@dodao/onboarding-schemas/config/networks.json';

export interface NearConfig {
  networkId: string;
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  explorerUrl: string;
}

export function getConfig(env): NearConfig {
  switch (env) {
    case 'production':
    case 'mainnet':
      return networks.NEAR.mainnet;
    case 'development':
    case 'testnet':
      return networks.NEAR.testnet;
    case 'betanet':
      return networks.NEAR.betanet;

    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.js.`
      );
  }
}
