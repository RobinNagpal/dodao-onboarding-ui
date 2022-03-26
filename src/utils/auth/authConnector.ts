export enum AuthConnector {
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

export function isSolanaConnector(authConnector: AuthConnector) {
  return (
    authConnector === AuthConnector.Phantom ||
    authConnector === AuthConnector.Solflare ||
    authConnector === AuthConnector.Slope
  );
}
