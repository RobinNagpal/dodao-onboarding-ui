import { guideTypes } from '@/helpers/sign/guideTypes';
import { spaceTypes } from '@/helpers/sign/spaceTypes';
import { GuideInput } from '@dodao/onboarding-schemas/inputs/GuideInput';
import { SpaceInput } from '@dodao/onboarding-schemas/inputs/SpaceInput';
import { Web3Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import Client from '@snapshot-labs/snapshot.js/src/sign';

export const domain = {
  name: 'DoDAO',
  version: '0.1'
  // chainId: 1
};

export default class OnboardingClient extends Client {
  async sign(web3: Web3Provider | Wallet, address: string, message, types) {
    // @ts-ignore
    const signer = web3?.getSigner ? web3.getSigner() : web3;
    if (!message.from) message.from = address;
    if (!message.timestamp)
      message.timestamp = parseInt((Date.now() / 1e3).toFixed());
    const data: any = { domain, types, message };
    const sig = await signer._signTypedData(domain, data.types, message);
    console.log('Sign', { address, sig, data });
    return await this.send({ address, sig, data });
  }

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
