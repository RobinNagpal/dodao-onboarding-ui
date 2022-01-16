import OnboardingClient from '@/helpers/onboardingClient';

const relayerUrl: string = (import.meta.env.VITE_RELAYER_URL ||
  'https://testnet.snapshot.org') as string;
const client = new OnboardingClient(relayerUrl);

export default client;
