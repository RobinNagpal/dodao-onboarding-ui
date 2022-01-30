import { guideTypes } from '@/helpers/sign/guideTypes';
import { spaceTypes } from '@/helpers/sign/spaceTypes';
import { GuideInput } from '@dodao/onboarding-schemas/inputs/GuideInput';
import { SpaceInput } from '@dodao/onboarding-schemas/inputs/SpaceInput';
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

  async spaceNew(
    web3: Web3Provider | Wallet,
    address: string,
    message: SpaceInput
  ) {
    console.log('write space', message);
    return await this.sign(web3, address, message, spaceTypes);
  }
}
