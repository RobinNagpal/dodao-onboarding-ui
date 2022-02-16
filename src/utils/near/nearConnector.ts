import LockConnector from '@/utils/auth/connector';
import { CustomProvider, Domain } from '@/utils/auth/customProvider';
import useNearWallet from '@/utils/near/useNearWallet';
import { KeyStore } from 'near-api-js/lib/key_stores/keystore';

export class NearProvider implements CustomProvider {
  connectorName = 'near';
  keyStore: KeyStore;
  networkId: string;
  accountId: string;
  constructor(keyStore: KeyStore, networkId: string, accountId: string) {
    this.keyStore = keyStore;
    this.networkId = networkId;
    this.accountId = accountId;
  }
  async _signTypedData(
    domain: Domain,
    types: any,
    message: any
  ): Promise<string> {
    const keyPair = await this.keyStore.getKey(this.networkId, this.accountId);
    const msg = Buffer.from(JSON.stringify({ domain, types, message }));
    const { signature } = keyPair.sign(msg);
    // https://stackoverflow.com/a/36949791/440432
    return new TextDecoder().decode(signature);
  }
}
export default class Connector extends LockConnector {
  near = useNearWallet();
  async connect() {
    console.log('near connect');
    await this.near.nearLogin();

    const wallet = this.near.nearWalletConnection.value;
    return new NearProvider(
      this.near.keyStore.value,
      wallet!._networkId!,
      wallet!.getAccountId()
    );
  }

  logout() {
    if (localStorage) {
      localStorage.removeItem('near');
    }
  }
}
