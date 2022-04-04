import { useWeb3 } from '@/composables/useWeb3';
import { getBlockchain } from '@/helpers/network';
import { bundleTypes } from '@/helpers/sign/bundleTypes';
import { guideSubmissionTypes } from '@/helpers/sign/guideSubmissionTypes';
import { guideTypes } from '@/helpers/sign/guideTypes';
import { loginTypes } from '@/helpers/sign/loginTypes';
import { spaceTypes } from '@/helpers/sign/spaceTypes';
import { CustomProvider } from '@/utils/auth/customProvider';
import { getJwt, getValidDecodedToken } from '@/utils/auth/jwtUtil';
import { BundleInput } from '@dodao/onboarding-schemas/inputs/BundleInput';
import { GuideInput } from '@dodao/onboarding-schemas/inputs/GuideInput';
import { GuideSubmissionInput } from '@dodao/onboarding-schemas/inputs/GuideSubmissionInput';
import { SpaceInput } from '@dodao/onboarding-schemas/inputs/SpaceInput';
import { Web3Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import Client from '@snapshot-labs/snapshot.js/src/sign';
import fetch from 'cross-fetch';

export const domain = {
  name: 'DoDAO',
  version: '0.1'
  // chainId: 1
};

export default class OnboardingClient extends Client {
  async sign(
    web3: Web3Provider | Wallet | CustomProvider,
    address: string,
    message,
    types
  ) {
    // @ts-ignore
    const signer = web3?.getSigner ? web3.getSigner() : web3;
    if (!message.from) message.from = address;
    const blockchain = getBlockchain();
    if (!message.blockchain) message.blockchain = blockchain.toString();
    if (!message.timestamp)
      message.timestamp = parseInt((Date.now() / 1e3).toFixed());

    const data: any = { domain, types, message };
    const jwt = getJwt();
    const fff = false;
    if (jwt && getValidDecodedToken() && fff) {
      const { web3: loggedIn } = useWeb3();

      console.log('loggedIn', loggedIn);
      const network = loggedIn.value.network.key;

      console.log('Sign', { address, data, blockchain, network });

      return await this.sendPrivate(jwt, {
        address,
        data,
        blockchain: blockchain,
        network: network
      });
    } else {
      const sig = await signer._signTypedData(domain, data.types, message);
      const { web3: loggedIn } = useWeb3();

      console.log('loggedIn', loggedIn);
      const network = loggedIn.value.network.key;

      console.log('Sign', { address, sig, data, blockchain, network });

      return await this.send({
        address,
        sig,
        data,
        blockchain: blockchain,
        network: network
      });
    }
  }

  async login(
    web3: Web3Provider | Wallet | CustomProvider,
    address: string,
    message: any
  ) {
    // @ts-ignore
    const signer = web3?.getSigner ? web3.getSigner() : web3;
    message.from = address;
    message.timestamp = parseInt((Date.now() / 1e3).toFixed());
    message.blockchain = getBlockchain();

    const data: any = { domain, types: loginTypes, message };
    const sig = await signer._signTypedData(domain, loginTypes, message);
    const { web3: loggedIn } = useWeb3();

    const network = loggedIn.value.network.key;

    return await this.send({
      address,
      sig,
      data,
      blockchain: getBlockchain().toString(),
      network: network
    });
  }

  async guide(
    web3: Web3Provider | Wallet,
    address: string,
    message: Omit<GuideInput, 'timestamp' | 'from'>
  ) {
    return await this.sign(web3, address, message, guideTypes);
  }

  async bundle(
    web3: Web3Provider | Wallet,
    address: string,
    message: Omit<BundleInput, 'timestamp' | 'from'>
  ) {
    return await this.sign(web3, address, message, bundleTypes);
  }

  async upsertSpace(
    web3: Web3Provider | Wallet,
    address: string,
    message: SpaceInput
  ) {
    console.log('write space', message);
    return await this.sign(web3, address, message, spaceTypes);
  }

  async createGuideResponse(
    web3: Web3Provider | Wallet,
    address: string,
    message: GuideSubmissionInput
  ) {
    console.log('guide response', message);
    return await this.sign(web3, address, message, guideSubmissionTypes);
  }

  async send(envelop) {
    const url = `${this.address}/api/msg`;
    const init = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(envelop)
    };
    return new Promise((resolve, reject) => {
      fetch(url, init)
        .then(res => {
          if (res.ok) return resolve(res.json());
          throw res;
        })
        .catch(e => e.json().then(json => reject(json)));
    });
  }

  async sendPrivate(jwt: string, envelop: any) {
    const url = `${this.address}/api/private`;
    const init = {
      method: 'POST',
      headers: {
        Authorization: jwt,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(envelop)
    };
    return new Promise((resolve, reject) => {
      fetch(url, init)
        .then(res => {
          if (res.ok) return resolve(res.json());
          throw res;
        })
        .catch(e => e.json().then(json => reject(json)));
    });
  }
}
