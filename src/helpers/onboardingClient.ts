import { Guide, guideTypes } from '@/helpers/sign/types';
import { Web3Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import Client from '@snapshot-labs/snapshot.js/src/sign';

export default class OnboardingClient extends Client {
  async guide(web3: Web3Provider | Wallet, address: string, message: Guide) {
    return await this.sign(web3, address, message, guideTypes);
  }
}
