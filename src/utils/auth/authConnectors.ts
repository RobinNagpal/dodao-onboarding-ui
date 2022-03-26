export enum AuthConnectors {
  injected = 'injected',
  near = 'near',
  gnosis = 'gnosis',
  trezor = 'trezor',
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
