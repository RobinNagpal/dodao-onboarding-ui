import { guideTypes } from '@/helpers/sign/guideTypes';
import { GuideInput } from '@dodao/onboarding-schemas/inputs/GuideInput';
import { Web3Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import Client from '@snapshot-labs/snapshot.js/src/sign';

export default class OnboardingClient extends Client {
  async guide(
    web3: Web3Provider | Wallet,
    address: string,
    message: Omit<GuideInput, 'timestamp' | 'from'>
  ) {
    return await this.sign(web3, address, message, guideTypes);
  }
}
