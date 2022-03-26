export enum AuthConnectors {
  injected = 'injected',
  gnosis = 'gnosis',
  trezor = 'trezor',
  walletlink = 'walletlink',
  walletconnect = 'walletconnect',
  portis = 'portis',

  near = 'near',

  Phantom = 'Phantom',
  Slope = 'Slope',
  Solflare = 'Solflare'
}

export function isSolanaConnector(authConnector: AuthConnectors) {
  return (
    authConnector === AuthConnectors.Phantom ||
    authConnector === AuthConnectors.Solflare ||
    authConnector === AuthConnectors.Slope
  );
}
