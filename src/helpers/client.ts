import OnboardingClient from '@/helpers/onboardingClient';

const hubUrl: string = (import.meta.env.VITE_HUB_URL ||
  'https://testnet.snapshot.org') as string;

const client = new OnboardingClient(hubUrl);

export default client;
